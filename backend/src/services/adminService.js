const bcrypt = require('bcryptjs');
const { query } = require('../database/connection');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/token');
const { toPagination } = require('../utils/sql');

function publicAdmin(admin) {
  return {
    admin_id: admin.admin_id,
    email: admin.email,
    full_name: admin.full_name,
    role: admin.role
  };
}

async function login(email, password) {
  const [admin] = await query('SELECT * FROM admins WHERE email = :email LIMIT 1', { email });

  if (!admin || !admin.is_active) {
    throw new AppError('Invalid admin credentials', 401);
  }

  const matches = await bcrypt.compare(password, admin.password_hash);
  if (!matches) {
    throw new AppError('Invalid admin credentials', 401);
  }

  const token = signToken({ sub: admin.admin_id, role: 'admin', email: admin.email });
  return { admin: publicAdmin(admin), token };
}

async function getMe(adminId) {
  const [admin] = await query('SELECT * FROM admins WHERE admin_id = :adminId', { adminId });
  if (!admin) throw new AppError('Admin not found', 404);
  return publicAdmin(admin);
}

async function getDashboard() {
  const [users] = await query('SELECT COUNT(*) AS total FROM customers WHERE deleted_at IS NULL');
  const [restaurants] = await query('SELECT COUNT(*) AS total FROM restaurants WHERE deleted_at IS NULL');
  const [orders] = await query('SELECT COUNT(*) AS total FROM orders');
  const [revenue] = await query(
    "SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE status <> 'cancelled'"
  );
  const recentOrders = await query(
    `SELECT o.order_id, o.status, o.total_amount, o.order_time,
      c.first_name, c.last_name, r.name AS restaurant_name
     FROM orders o
     JOIN customers c ON c.customer_id = o.customer_id
     JOIN restaurants r ON r.restaurant_id = o.restaurant_id
     ORDER BY o.order_time DESC
     LIMIT 8`
  );

  return {
    totals: {
      users: users.total,
      restaurants: restaurants.total,
      orders: orders.total,
      revenue: Number(revenue.total)
    },
    recentOrders
  };
}

async function getAnalytics() {
  const daily = await query(
    `SELECT DATE(order_time) AS day,
      COUNT(*) AS orders,
      COALESCE(SUM(CASE WHEN status <> 'cancelled' THEN total_amount ELSE 0 END), 0) AS revenue
     FROM orders
     GROUP BY DATE(order_time)
     ORDER BY day DESC
     LIMIT 14`
  );

  const topRestaurants = await query(
    `SELECT r.restaurant_id, r.name, COUNT(o.order_id) AS orders,
      COALESCE(SUM(CASE WHEN o.status <> 'cancelled' THEN o.total_amount ELSE 0 END), 0) AS revenue
     FROM restaurants r
     LEFT JOIN orders o ON o.restaurant_id = r.restaurant_id
     GROUP BY r.restaurant_id, r.name
     ORDER BY revenue DESC
     LIMIT 5`
  );

  return { daily, topRestaurants };
}

async function listUsers(filters) {
  const { limit, offset, page } = toPagination(filters);
  const params = {};
  const clauses = ['deleted_at IS NULL'];

  if (filters.search) {
    clauses.push('(email LIKE :search OR first_name LIKE :search OR last_name LIKE :search OR phone LIKE :search)');
    params.search = `%${filters.search}%`;
  }

  if (filters.status === 'active') clauses.push('is_active = TRUE');
  if (filters.status === 'blocked') clauses.push('is_active = FALSE');

  const rows = await query(
    `SELECT customer_id, email, phone, first_name, last_name, address, city, pincode,
      is_active, email_verified, created_at
     FROM customers
     WHERE ${clauses.join(' AND ')}
     ORDER BY created_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  return { page, limit, data: rows };
}

async function getUserDetails(customerId) {
  const [customer] = await query(
    `SELECT customer_id, email, phone, first_name, last_name, address, city, pincode,
      is_active, email_verified, created_at
     FROM customers
     WHERE customer_id = :customerId AND deleted_at IS NULL`,
    { customerId }
  );

  if (!customer) throw new AppError('User not found', 404);

  const orders = await query(
    `SELECT o.order_id, o.status, o.total_amount, o.order_time, r.name AS restaurant_name
     FROM orders o
     JOIN restaurants r ON r.restaurant_id = o.restaurant_id
     WHERE o.customer_id = :customerId
     ORDER BY o.order_time DESC`,
    { customerId }
  );

  return { customer, orders };
}

async function setUserStatus(customerId, isActive) {
  const result = await query(
    'UPDATE customers SET is_active = :isActive WHERE customer_id = :customerId AND deleted_at IS NULL',
    { customerId, isActive }
  );
  if (!result.affectedRows) throw new AppError('User not found', 404);
  return getUserDetails(customerId);
}

async function deleteUser(customerId) {
  const result = await query(
    'UPDATE customers SET is_active = FALSE, deleted_at = CURRENT_TIMESTAMP WHERE customer_id = :customerId AND deleted_at IS NULL',
    { customerId }
  );
  if (!result.affectedRows) throw new AppError('User not found', 404);
  return { customer_id: customerId, deleted: true };
}

async function listRestaurants(filters) {
  const { limit, offset, page } = toPagination(filters);
  const params = {};
  const clauses = ['deleted_at IS NULL'];

  if (filters.search) {
    clauses.push('(name LIKE :search OR cuisine_type LIKE :search OR city LIKE :search)');
    params.search = `%${filters.search}%`;
  }

  if (filters.status === 'approved') clauses.push('is_approved = TRUE');
  if (filters.status === 'pending') clauses.push('is_approved = FALSE');

  const rows = await query(
    `SELECT restaurant_id, name, owner_name, email, phone, address, city, pincode,
      cuisine_type, description, avg_rating, delivery_fee, is_open, is_approved, created_at
     FROM restaurants
     WHERE ${clauses.join(' AND ')}
     ORDER BY created_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  return { page, limit, data: rows };
}

async function getRestaurant(restaurantId) {
  const [restaurant] = await query(
    'SELECT * FROM restaurants WHERE restaurant_id = :restaurantId AND deleted_at IS NULL',
    { restaurantId }
  );
  if (!restaurant) throw new AppError('Restaurant not found', 404);
  return restaurant;
}

async function createRestaurant(payload) {
  const passwordHash = payload.owner_password
    ? await bcrypt.hash(payload.owner_password, Number(process.env.BCRYPT_ROUNDS || 10))
    : null;
  const result = await query(
    `INSERT INTO restaurants
      (name, owner_name, email, password_hash, phone, address, city, pincode, cuisine_type, description, delivery_fee, is_open, is_approved)
     VALUES
      (:name, :owner_name, :email, :password_hash, :phone, :address, :city, :pincode, :cuisine_type, :description, :delivery_fee, :is_open, :is_approved)`,
    {
      ...payload,
      password_hash: passwordHash,
      description: payload.description || null,
      delivery_fee: payload.delivery_fee ?? 0,
      is_open: payload.is_open ?? true,
      is_approved: payload.is_approved ?? true
    }
  );
  return getRestaurant(result.insertId);
}

async function updateRestaurant(restaurantId, payload) {
  const allowed = [
    'name', 'owner_name', 'email', 'phone', 'address', 'city', 'pincode',
    'cuisine_type', 'description', 'delivery_fee', 'is_open', 'is_approved'
  ];
  const fields = allowed.filter((field) => Object.prototype.hasOwnProperty.call(payload, field));
  const params = { restaurantId };

  if (!fields.length) throw new AppError('No restaurant fields provided', 400);

  for (const field of fields) params[field] = payload[field];

  const result = await query(
    `UPDATE restaurants
     SET ${fields.map((field) => `${field} = :${field}`).join(', ')}
     WHERE restaurant_id = :restaurantId AND deleted_at IS NULL`,
    params
  );
  if (!result.affectedRows) throw new AppError('Restaurant not found', 404);
  return getRestaurant(restaurantId);
}

async function setRestaurantApproval(restaurantId, isApproved) {
  return updateRestaurant(restaurantId, { is_approved: isApproved });
}

async function deleteRestaurant(restaurantId) {
  const result = await query(
    'UPDATE restaurants SET is_open = FALSE, deleted_at = CURRENT_TIMESTAMP WHERE restaurant_id = :restaurantId AND deleted_at IS NULL',
    { restaurantId }
  );
  if (!result.affectedRows) throw new AppError('Restaurant not found', 404);
  return { restaurant_id: restaurantId, deleted: true };
}

async function listOrders(filters) {
  const { limit, offset, page } = toPagination(filters);
  const params = {};
  const clauses = ['1 = 1'];

  if (filters.status) {
    clauses.push('o.status = :status');
    params.status = filters.status;
  }

  if (filters.search) {
    clauses.push('(CAST(o.order_id AS CHAR) LIKE :search OR c.email LIKE :search OR r.name LIKE :search)');
    params.search = `%${filters.search}%`;
  }

  const rows = await query(
    `SELECT o.order_id, o.status, o.total_amount, o.order_time, o.delivery_address,
      c.customer_id, c.email AS customer_email, c.first_name, c.last_name,
      r.restaurant_id, r.name AS restaurant_name,
      da.agent_id AS delivery_agent_id, da.name AS delivery_agent_name
     FROM orders o
     JOIN customers c ON c.customer_id = o.customer_id
     JOIN restaurants r ON r.restaurant_id = o.restaurant_id
     LEFT JOIN deliveryagents da ON da.agent_id = o.delivery_agent_id
     WHERE ${clauses.join(' AND ')}
     ORDER BY o.order_time DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  return { page, limit, data: rows };
}

async function getOrder(orderId) {
  const [order] = await query(
    `SELECT o.*, c.email AS customer_email, c.first_name, c.last_name,
      r.name AS restaurant_name, p.payment_method, p.status AS payment_status
     FROM orders o
     JOIN customers c ON c.customer_id = o.customer_id
     JOIN restaurants r ON r.restaurant_id = o.restaurant_id
     LEFT JOIN payments p ON p.order_id = o.order_id
     WHERE o.order_id = :orderId`,
    { orderId }
  );
  if (!order) throw new AppError('Order not found', 404);

  const items = await query(
    `SELECT oi.order_item_id, oi.item_id, mi.item_name, oi.quantity, oi.unit_price, oi.subtotal
     FROM orderitems oi
     JOIN menuitems mi ON mi.item_id = oi.item_id
     WHERE oi.order_id = :orderId`,
    { orderId }
  );

  return { ...order, items };
}

function assertAdminStatusTransition(currentStatus, nextStatus) {
  if (currentStatus === nextStatus) return;

  const allowedTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['preparing', 'cancelled'],
    preparing: ['ready', 'cancelled'],
    ready: ['picked_up', 'cancelled'],
    picked_up: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: []
  };

  if (!allowedTransitions[currentStatus]?.includes(nextStatus)) {
    throw new AppError(`Cannot change order from ${currentStatus} to ${nextStatus}`, 400);
  }
}

function isClosedOrderStatus(status) {
  return ['delivered', 'cancelled'].includes(status);
}

async function updateOrderStatus(orderId, payload) {
  const currentOrder = await getOrder(orderId);
  const nextStatus = payload.status;
  const nextAgentId = payload.delivery_agent_id ?? currentOrder.delivery_agent_id;

  assertAdminStatusTransition(currentOrder.status, nextStatus);

  if (payload.delivery_agent_id !== undefined && payload.delivery_agent_id !== null) {
    const [agent] = await query(
      'SELECT agent_id, is_available FROM deliveryagents WHERE agent_id = :agentId',
      { agentId: payload.delivery_agent_id }
    );

    if (!agent) throw new AppError('Delivery agent not found', 404);

    const isSameAgent = Number(currentOrder.delivery_agent_id) === Number(payload.delivery_agent_id);
    if (!isSameAgent && !agent.is_available) {
      throw new AppError('Delivery agent is not available', 400);
    }
  }

  if (payload.delivery_agent_id !== undefined && payload.delivery_agent_id !== null && isClosedOrderStatus(nextStatus)) {
    throw new AppError('Cannot assign a delivery agent to a closed order', 400);
  }

  const fields = ['status = :status'];
  const params = { orderId, status: payload.status };

  if (payload.delivery_agent_id !== undefined) {
    fields.push('delivery_agent_id = :delivery_agent_id');
    params.delivery_agent_id = payload.delivery_agent_id;
  }

  if (payload.status === 'delivered') fields.push('actual_delivery_time = NOW()');

  const result = await query(
    `UPDATE orders SET ${fields.join(', ')} WHERE order_id = :orderId`,
    params
  );
  if (!result.affectedRows) throw new AppError('Order not found', 404);

  if (currentOrder.delivery_agent_id && currentOrder.delivery_agent_id !== nextAgentId) {
    await query(
      'UPDATE deliveryagents SET is_available = TRUE WHERE agent_id = :agentId',
      { agentId: currentOrder.delivery_agent_id }
    );
  }

  if (nextAgentId) {
    await query(
      'UPDATE deliveryagents SET is_available = :isAvailable WHERE agent_id = :agentId',
      { agentId: nextAgentId, isAvailable: isClosedOrderStatus(nextStatus) }
    );
  }

  return getOrder(orderId);
}

async function listDeliveryAgents(filters = {}) {
  const { limit, offset, page } = toPagination(filters);
  const params = {};
  const clauses = ['1 = 1'];

  if (filters.search) {
    clauses.push('(name LIKE :search OR email LIKE :search OR phone LIKE :search OR license_number LIKE :search)');
    params.search = `%${filters.search}%`;
  }

  if (filters.status === 'available') clauses.push('is_available = TRUE');
  if (filters.status === 'offline') clauses.push('is_available = FALSE');

  const rows = await query(
    `SELECT agent_id, name, email, phone, vehicle_type, license_number,
      is_available, current_location, total_deliveries, avg_rating, created_at
     FROM deliveryagents
     WHERE ${clauses.join(' AND ')}
     ORDER BY is_available DESC, name ASC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  return { page, limit, data: rows };
}

async function getDeliveryAgent(agentId) {
  const [agent] = await query(
    `SELECT agent_id, name, email, phone, vehicle_type, license_number,
      is_available, current_location, total_deliveries, avg_rating, created_at
     FROM deliveryagents
     WHERE agent_id = :agentId`,
    { agentId }
  );
  if (!agent) throw new AppError('Delivery agent not found', 404);
  return agent;
}

async function createDeliveryAgent(payload) {
  const result = await query(
    `INSERT INTO deliveryagents
      (name, email, phone, vehicle_type, license_number, is_available, current_location)
     VALUES
      (:name, :email, :phone, :vehicle_type, :license_number, :is_available, :current_location)`,
    {
      ...payload,
      current_location: payload.current_location || null
    }
  );

  return getDeliveryAgent(result.insertId);
}

async function updateDeliveryAgent(agentId, payload) {
  const allowed = ['name', 'email', 'phone', 'vehicle_type', 'license_number', 'is_available', 'current_location'];
  const fields = allowed.filter((field) => Object.prototype.hasOwnProperty.call(payload, field));
  const params = { agentId };

  if (!fields.length) throw new AppError('No delivery agent fields provided', 400);
  for (const field of fields) {
    params[field] = field === 'current_location' && payload[field] === '' ? null : payload[field];
  }

  const result = await query(
    `UPDATE deliveryagents
     SET ${fields.map((field) => `${field} = :${field}`).join(', ')}
     WHERE agent_id = :agentId`,
    params
  );

  if (!result.affectedRows) throw new AppError('Delivery agent not found', 404);
  return getDeliveryAgent(agentId);
}

async function deleteDeliveryAgent(agentId) {
  const assignedOrders = await query(
    `SELECT order_id
     FROM orders
     WHERE delivery_agent_id = :agentId
      AND status IN ('confirmed', 'preparing', 'ready', 'picked_up')
     LIMIT 1`,
    { agentId }
  );

  if (assignedOrders.length) {
    throw new AppError('Cannot delete a delivery agent with active assigned orders', 400);
  }

  await query(
    'UPDATE orders SET delivery_agent_id = NULL WHERE delivery_agent_id = :agentId',
    { agentId }
  );

  const result = await query('DELETE FROM deliveryagents WHERE agent_id = :agentId', { agentId });
  if (!result.affectedRows) throw new AppError('Delivery agent not found', 404);
  return { agent_id: agentId, deleted: true };
}

module.exports = {
  login,
  getMe,
  getDashboard,
  getAnalytics,
  listUsers,
  getUserDetails,
  setUserStatus,
  deleteUser,
  listRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  setRestaurantApproval,
  deleteRestaurant,
  listOrders,
  getOrder,
  updateOrderStatus,
  listDeliveryAgents,
  getDeliveryAgent,
  createDeliveryAgent,
  updateDeliveryAgent,
  deleteDeliveryAgent
};
