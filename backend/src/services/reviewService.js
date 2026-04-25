const { query } = require('../database/connection');
const AppError = require('../utils/AppError');

async function createReview(customerId, payload) {
  const [order] = await query(
    `SELECT order_id, restaurant_id, customer_id, status
     FROM orders
     WHERE order_id = :orderId AND customer_id = :customerId`,
    { orderId: payload.order_id, customerId }
  );

  if (!order || order.restaurant_id !== payload.restaurant_id) {
    throw new AppError('Only matching customer orders can be reviewed', 403);
  }

  if (order.status !== 'delivered') {
    throw new AppError('Only delivered orders can be reviewed', 400);
  }

  try {
    const result = await query(
      `INSERT INTO reviews
        (customer_id, restaurant_id, order_id, rating, comment)
       VALUES
        (:customer_id, :restaurant_id, :order_id, :rating, :comment)`,
      {
        customer_id: customerId,
        restaurant_id: payload.restaurant_id,
        order_id: payload.order_id,
        rating: payload.rating,
        comment: payload.comment || null
      }
    );

    const [review] = await query('SELECT * FROM reviews WHERE review_id = :id', {
      id: result.insertId
    });
    return review;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new AppError('This order has already been reviewed', 409);
    }
    throw error;
  }
}

async function listRestaurantReviews(restaurantId) {
  return query(
    `SELECT rv.review_id, rv.rating, rv.comment, rv.created_at,
      c.first_name, c.last_name
     FROM reviews rv
     JOIN customers c ON c.customer_id = rv.customer_id
     WHERE rv.restaurant_id = :restaurantId AND rv.is_approved = 1
     ORDER BY rv.created_at DESC`,
    { restaurantId }
  );
}

module.exports = {
  createReview,
  listRestaurantReviews
};
