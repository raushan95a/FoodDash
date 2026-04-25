const bcrypt = require('bcryptjs');
const { query } = require('../database/connection');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/token');

function publicRestaurant(restaurant) {
  return {
    restaurant_id: restaurant.restaurant_id,
    name: restaurant.name,
    owner_name: restaurant.owner_name,
    email: restaurant.email,
    phone: restaurant.phone,
    address: restaurant.address,
    city: restaurant.city,
    pincode: restaurant.pincode,
    cuisine_type: restaurant.cuisine_type,
    description: restaurant.description,
    avg_rating: Number(restaurant.avg_rating || 0),
    delivery_fee: Number(restaurant.delivery_fee || 0),
    is_open: Boolean(restaurant.is_open),
    is_approved: Boolean(restaurant.is_approved),
    role: 'restaurant'
  };
}

async function getRestaurantById(restaurantId) {
  const [restaurant] = await query(
    `SELECT restaurant_id, name, owner_name, email, phone, address, city, pincode,
      cuisine_type, description, avg_rating, delivery_fee, is_open, is_approved, deleted_at
     FROM restaurants
     WHERE restaurant_id = :restaurantId AND deleted_at IS NULL`,
    { restaurantId }
  );

  if (!restaurant) throw new AppError('Restaurant not found', 404);
  return restaurant;
}

async function login(email, password) {
  const [restaurant] = await query(
    'SELECT * FROM restaurants WHERE email = :email AND deleted_at IS NULL LIMIT 1',
    { email }
  );

  if (!restaurant || !restaurant.password_hash) {
    throw new AppError('Invalid restaurant credentials', 401);
  }

  const matches = await bcrypt.compare(password, restaurant.password_hash);
  if (!matches) {
    throw new AppError('Invalid restaurant credentials', 401);
  }

  if (!restaurant.is_approved) {
    throw new AppError('Restaurant account is pending admin approval', 403);
  }

  const token = signToken({ sub: restaurant.restaurant_id, role: 'restaurant', email: restaurant.email });
  return { restaurant: publicRestaurant(restaurant), token };
}

async function getMe(restaurantId) {
  const restaurant = await getRestaurantById(restaurantId);
  return publicRestaurant(restaurant);
}

async function getDashboard(restaurantId) {
  await getRestaurantById(restaurantId);

  const [summary] = await query(
    `SELECT
      COUNT(*) AS total_orders,
      COALESCE(SUM(CASE WHEN status <> 'cancelled' THEN total_amount ELSE 0 END), 0) AS total_revenue,
      SUM(status = 'pending') AS pending_orders,
      SUM(status IN ('confirmed', 'preparing', 'ready')) AS active_orders
     FROM orders
     WHERE restaurant_id = :restaurantId`,
    { restaurantId }
  );

  const [menuSummary] = await query(
    `SELECT COUNT(*) AS total_items, SUM(is_available = TRUE) AS available_items
     FROM menuitems
     WHERE restaurant_id = :restaurantId`,
    { restaurantId }
  );

  const recentOrders = await query(
    `SELECT o.order_id, o.status, o.total_amount, o.order_time,
      c.first_name, c.last_name, c.email AS customer_email
     FROM orders o
     JOIN customers c ON c.customer_id = o.customer_id
     WHERE o.restaurant_id = :restaurantId
     ORDER BY o.order_time DESC
     LIMIT 8`,
    { restaurantId }
  );

  const topItems = await query(
    `SELECT mi.item_id, mi.item_name, COALESCE(SUM(oi.quantity), 0) AS quantity_sold,
      COALESCE(SUM(oi.subtotal), 0) AS revenue
     FROM menuitems mi
     LEFT JOIN orderitems oi ON oi.item_id = mi.item_id
     LEFT JOIN orders o ON o.order_id = oi.order_id AND o.status <> 'cancelled'
     WHERE mi.restaurant_id = :restaurantId
     GROUP BY mi.item_id, mi.item_name
     ORDER BY quantity_sold DESC, revenue DESC
     LIMIT 5`,
    { restaurantId }
  );

  return {
    totals: {
      orders: Number(summary.total_orders || 0),
      revenue: Number(summary.total_revenue || 0),
      pending_orders: Number(summary.pending_orders || 0),
      active_orders: Number(summary.active_orders || 0),
      menu_items: Number(menuSummary.total_items || 0),
      available_items: Number(menuSummary.available_items || 0)
    },
    recentOrders,
    topItems
  };
}

async function updateProfile(restaurantId, payload) {
  const allowed = [
    'name', 'owner_name', 'phone', 'address', 'city', 'pincode',
    'cuisine_type', 'description', 'delivery_fee', 'is_open'
  ];
  const fields = allowed.filter((field) => Object.prototype.hasOwnProperty.call(payload, field));
  const params = { restaurantId };

  for (const field of fields) params[field] = payload[field];

  const result = await query(
    `UPDATE restaurants
     SET ${fields.map((field) => `${field} = :${field}`).join(', ')}
     WHERE restaurant_id = :restaurantId AND deleted_at IS NULL`,
    params
  );

  if (!result.affectedRows) throw new AppError('Restaurant not found', 404);
  return getMe(restaurantId);
}

async function listMenu(restaurantId) {
  await getRestaurantById(restaurantId);
  return query(
    `SELECT item_id, restaurant_id, item_name, description, price, category,
      image_url, is_veg, is_available, created_at
     FROM menuitems
     WHERE restaurant_id = :restaurantId
     ORDER BY category, item_name`,
    { restaurantId }
  );
}

async function getMenuItemForOwner(restaurantId, itemId) {
  const [item] = await query(
    'SELECT * FROM menuitems WHERE restaurant_id = :restaurantId AND item_id = :itemId',
    { restaurantId, itemId }
  );
  if (!item) throw new AppError('Menu item not found', 404);
  return item;
}

async function createMenuItem(restaurantId, payload) {
  await getRestaurantById(restaurantId);
  const result = await query(
    `INSERT INTO menuitems
      (restaurant_id, item_name, description, price, category, image_url, is_veg, is_available)
     VALUES
      (:restaurantId, :item_name, :description, :price, :category, :image_url, :is_veg, :is_available)`,
    {
      restaurantId,
      ...payload,
      description: payload.description || null,
      image_url: payload.image_url || null,
      is_available: payload.is_available ?? true
    }
  );

  return getMenuItemForOwner(restaurantId, result.insertId);
}

async function updateMenuItem(restaurantId, itemId, payload) {
  await getMenuItemForOwner(restaurantId, itemId);
  const allowed = ['item_name', 'description', 'price', 'category', 'image_url', 'is_veg', 'is_available'];
  const fields = allowed.filter((field) => Object.prototype.hasOwnProperty.call(payload, field));
  const params = { restaurantId, itemId };

  for (const field of fields) params[field] = payload[field];

  await query(
    `UPDATE menuitems
     SET ${fields.map((field) => `${field} = :${field}`).join(', ')}
     WHERE restaurant_id = :restaurantId AND item_id = :itemId`,
    params
  );

  return getMenuItemForOwner(restaurantId, itemId);
}

async function deleteMenuItem(restaurantId, itemId) {
  await getMenuItemForOwner(restaurantId, itemId);
  await query(
    'UPDATE menuitems SET is_available = FALSE WHERE restaurant_id = :restaurantId AND item_id = :itemId',
    { restaurantId, itemId }
  );

  return { item_id: itemId, hidden: true };
}

async function listOrders(restaurantId, filters = {}) {
  await getRestaurantById(restaurantId);
  const params = { restaurantId };
  const clauses = ['o.restaurant_id = :restaurantId'];

  if (filters.status) {
    clauses.push('o.status = :status');
    params.status = filters.status;
  }

  const rows = await query(
    `SELECT o.order_id, o.status, o.total_amount, o.order_time, o.delivery_address,
      c.customer_id, c.email AS customer_email, c.first_name, c.last_name,
      p.payment_method, p.status AS payment_status
     FROM orders o
     JOIN customers c ON c.customer_id = o.customer_id
     LEFT JOIN payments p ON p.order_id = o.order_id
     WHERE ${clauses.join(' AND ')}
     ORDER BY o.order_time DESC`,
    params
  );

  return rows;
}

async function getOrder(restaurantId, orderId) {
  const [order] = await query(
    `SELECT o.*, c.email AS customer_email, c.first_name, c.last_name,
      p.payment_method, p.status AS payment_status
     FROM orders o
     JOIN customers c ON c.customer_id = o.customer_id
     LEFT JOIN payments p ON p.order_id = o.order_id
     WHERE o.restaurant_id = :restaurantId AND o.order_id = :orderId`,
    { restaurantId, orderId }
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

async function updateOrderStatus(restaurantId, orderId, status) {
  await getOrder(restaurantId, orderId);

  const fields = ['status = :status'];
  if (status === 'delivered') fields.push('actual_delivery_time = NOW()');

  await query(
    `UPDATE orders
     SET ${fields.join(', ')}
     WHERE restaurant_id = :restaurantId AND order_id = :orderId`,
    { restaurantId, orderId, status }
  );

  return getOrder(restaurantId, orderId);
}

module.exports = {
  login,
  getMe,
  getDashboard,
  updateProfile,
  listMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  listOrders,
  getOrder,
  updateOrderStatus
};
