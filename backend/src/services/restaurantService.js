const bcrypt = require('bcryptjs');
const { query } = require('../database/connection');
const AppError = require('../utils/AppError');
const { toPagination } = require('../utils/sql');

async function listRestaurants(filters) {
  const { limit, offset, page } = toPagination(filters);
  const params = { limit, offset };
  const clauses = ['is_approved = 1', 'deleted_at IS NULL'];

  if (filters.city) {
    clauses.push('city = :city');
    params.city = filters.city;
  }

  if (filters.cuisine_type) {
    clauses.push('cuisine_type = :cuisine_type');
    params.cuisine_type = filters.cuisine_type;
  }

  if (filters.search) {
    clauses.push('(name LIKE :search OR cuisine_type LIKE :search)');
    params.search = `%${filters.search}%`;
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const rows = await query(
    `SELECT restaurant_id, name, owner_name, email, phone, address, city, pincode,
      cuisine_type, description, avg_rating, delivery_fee, is_open, is_approved
     FROM restaurants
     ${where}
     ORDER BY avg_rating DESC, name ASC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  return { page, limit, data: rows };
}

async function getRestaurant(id) {
  const [restaurant] = await query(
    `SELECT restaurant_id, name, owner_name, email, phone, address, city, pincode,
      cuisine_type, description, avg_rating, delivery_fee, is_open, is_approved
     FROM restaurants
     WHERE restaurant_id = :id AND deleted_at IS NULL`,
    { id }
  );

  if (!restaurant) {
    throw new AppError('Restaurant not found', 404);
  }

  return restaurant;
}

async function createRestaurant(payload) {
  const passwordHash = payload.owner_password
    ? await bcrypt.hash(payload.owner_password, Number(process.env.BCRYPT_ROUNDS || 10))
    : null;
  const result = await query(
    `INSERT INTO restaurants
      (name, owner_name, email, password_hash, phone, address, city, pincode, cuisine_type, description, delivery_fee, is_approved)
     VALUES
      (:name, :owner_name, :email, :password_hash, :phone, :address, :city, :pincode, :cuisine_type, :description, :delivery_fee, FALSE)`,
    {
      ...payload,
      password_hash: passwordHash,
      description: payload.description || null
    }
  );

  return getRestaurant(result.insertId);
}

async function getMenu(restaurantId) {
  await getRestaurant(restaurantId);
  return query(
    `SELECT item_id, restaurant_id, item_name, description, price, category,
      image_url, is_veg, is_available
     FROM menuitems
     WHERE restaurant_id = :restaurantId
     ORDER BY category, item_name`,
    { restaurantId }
  );
}

async function createMenuItem(restaurantId, payload) {
  await getRestaurant(restaurantId);
  const result = await query(
    `INSERT INTO menuitems
      (restaurant_id, item_name, description, price, category, image_url, is_veg, is_available)
     VALUES
      (:restaurant_id, :item_name, :description, :price, :category, :image_url, :is_veg, :is_available)`,
    {
      restaurant_id: restaurantId,
      ...payload,
      description: payload.description || null,
      image_url: payload.image_url || null
    }
  );

  const [item] = await query('SELECT * FROM menuitems WHERE item_id = :id', { id: result.insertId });
  return item;
}

module.exports = {
  listRestaurants,
  getRestaurant,
  createRestaurant,
  getMenu,
  createMenuItem
};
