const { query, transaction } = require('../database/connection');
const AppError = require('../utils/AppError');

async function createOrder(customerId, payload) {
  const orderId = await transaction(async (connection) => {
    const [restaurants] = await connection.execute(
      'SELECT restaurant_id, delivery_fee, is_open FROM restaurants WHERE restaurant_id = ? AND is_approved = 1',
      [payload.restaurant_id]
    );
    const restaurant = restaurants[0];

    if (!restaurant || !restaurant.is_open) {
      throw new AppError('Restaurant is not available for orders', 400);
    }

    const itemIds = payload.items.map((item) => item.item_id);
    const placeholders = itemIds.map(() => '?').join(',');
    const [menuItems] = await connection.execute(
      `SELECT item_id, restaurant_id, item_name, price, is_available
       FROM menuitems
       WHERE item_id IN (${placeholders}) AND restaurant_id = ?`,
      [...itemIds, payload.restaurant_id]
    );

    if (menuItems.length !== itemIds.length) {
      throw new AppError('One or more menu items are invalid for this restaurant', 400);
    }

    const menuById = new Map(menuItems.map((item) => [item.item_id, item]));
    let subtotal = 0;

    const orderItems = payload.items.map((item) => {
      const menuItem = menuById.get(item.item_id);
      if (!menuItem.is_available) {
        throw new AppError(`${menuItem.item_name} is currently unavailable`, 400);
      }

      const itemSubtotal = Number(menuItem.price) * item.quantity;
      subtotal += itemSubtotal;

      return {
        item_id: item.item_id,
        quantity: item.quantity,
        unit_price: Number(menuItem.price),
        subtotal: itemSubtotal,
        special_instructions: item.special_instructions || null
      };
    });

    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = Number((subtotal + tax + Number(restaurant.delivery_fee)).toFixed(2));

    const [orderResult] = await connection.execute(
      `INSERT INTO orders
        (customer_id, restaurant_id, status, total_amount, delivery_address, special_instructions, estimated_delivery_time)
       VALUES (?, ?, 'pending', ?, ?, ?, DATE_ADD(NOW(), INTERVAL 45 MINUTE))`,
      [
        customerId,
        payload.restaurant_id,
        total,
        payload.delivery_address,
        payload.special_instructions || null
      ]
    );

    const orderId = orderResult.insertId;
    for (const item of orderItems) {
      await connection.execute(
        `INSERT INTO orderitems
          (order_id, item_id, quantity, unit_price, subtotal, special_instructions)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.item_id, item.quantity, item.unit_price, item.subtotal, item.special_instructions]
      );
    }

    await connection.execute(
      `INSERT INTO payments (order_id, customer_id, amount, payment_method, status)
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, customerId, total, payload.payment_method, payload.payment_method === 'cash' ? 'pending' : 'success']
    );

    return orderId;
  });

  return getOrderById(orderId, customerId);
}

async function getOrderById(orderId, customerId = null) {
  const params = { orderId };
  const customerClause = customerId ? 'AND o.customer_id = :customerId' : '';
  if (customerId) params.customerId = customerId;

  const [order] = await query(
    `SELECT o.*, r.name AS restaurant_name, da.name AS delivery_agent_name,
      p.payment_method, p.status AS payment_status
     FROM orders o
     JOIN restaurants r ON r.restaurant_id = o.restaurant_id
     LEFT JOIN deliveryagents da ON da.agent_id = o.delivery_agent_id
     LEFT JOIN payments p ON p.order_id = o.order_id
     WHERE o.order_id = :orderId ${customerClause}`,
    params
  );

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const items = await query(
    `SELECT oi.order_item_id, oi.item_id, mi.item_name, oi.quantity, oi.unit_price,
      oi.subtotal, oi.special_instructions
     FROM orderitems oi
     JOIN menuitems mi ON mi.item_id = oi.item_id
     WHERE oi.order_id = :orderId`,
    { orderId }
  );

  return { ...order, items };
}

async function listCustomerOrders(customerId) {
  return query(
    `SELECT o.order_id, o.status, o.total_amount, o.order_time, o.estimated_delivery_time,
      o.actual_delivery_time, r.name AS restaurant_name
     FROM orders o
     JOIN restaurants r ON r.restaurant_id = o.restaurant_id
     WHERE o.customer_id = :customerId
     ORDER BY o.order_time DESC`,
    { customerId }
  );
}

module.exports = {
  createOrder,
  getOrderById,
  listCustomerOrders
};
