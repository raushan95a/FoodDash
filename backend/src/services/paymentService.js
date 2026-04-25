const { query } = require('../database/connection');
const AppError = require('../utils/AppError');

async function upsertPayment(customerId, payload) {
  const [order] = await query(
    'SELECT order_id, customer_id, total_amount FROM orders WHERE order_id = :orderId',
    { orderId: payload.order_id }
  );

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.customer_id !== customerId) {
    throw new AppError('You cannot pay for this order', 403);
  }

  await query(
    `INSERT INTO payments
      (order_id, customer_id, amount, payment_method, transaction_id, status, paid_at)
     VALUES
      (:order_id, :customer_id, :amount, :payment_method, :transaction_id, :status,
       CASE WHEN :status = 'success' THEN NOW() ELSE NULL END)
     ON DUPLICATE KEY UPDATE
      payment_method = VALUES(payment_method),
      transaction_id = VALUES(transaction_id),
      status = VALUES(status),
      paid_at = VALUES(paid_at),
      updated_at = CURRENT_TIMESTAMP`,
    {
      order_id: payload.order_id,
      customer_id: customerId,
      amount: order.total_amount,
      payment_method: payload.payment_method,
      transaction_id: payload.transaction_id || null,
      status: payload.status
    }
  );

  const [payment] = await query('SELECT * FROM payments WHERE order_id = :orderId', {
    orderId: payload.order_id
  });

  return payment;
}

module.exports = {
  upsertPayment
};
