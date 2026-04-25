const bcrypt = require('bcryptjs');
const { query } = require('../database/connection');
const env = require('../config/environment');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/token');

function publicCustomer(customer) {
  return {
    customer_id: customer.customer_id,
    email: customer.email,
    phone: customer.phone,
    first_name: customer.first_name,
    last_name: customer.last_name,
    address: customer.address,
    city: customer.city,
    pincode: customer.pincode,
    is_active: Boolean(customer.is_active),
    email_verified: Boolean(customer.email_verified),
    created_at: customer.created_at
  };
}

async function register(payload) {
  const existing = await query(
    'SELECT customer_id FROM customers WHERE email = :email LIMIT 1',
    { email: payload.email }
  );

  if (existing.length) {
    throw new AppError('Email is already registered', 409);
  }

  const passwordHash = await bcrypt.hash(payload.password, env.bcryptRounds);
  const result = await query(
    `INSERT INTO customers
      (email, password_hash, phone, first_name, last_name, address, city, pincode)
     VALUES
      (:email, :password_hash, :phone, :first_name, :last_name, :address, :city, :pincode)`,
    {
      email: payload.email,
      password_hash: passwordHash,
      phone: payload.phone,
      first_name: payload.first_name,
      last_name: payload.last_name || null,
      address: payload.address || null,
      city: payload.city || null,
      pincode: payload.pincode || null
    }
  );

  const [customer] = await query('SELECT * FROM customers WHERE customer_id = :id', {
    id: result.insertId
  });
  const token = signToken({ sub: customer.customer_id, role: 'customer', email: customer.email });

  return { customer: publicCustomer(customer), token };
}

async function login(email, password) {
  const [customer] = await query('SELECT * FROM customers WHERE email = :email LIMIT 1', { email });

  if (!customer || !customer.is_active) {
    throw new AppError('Invalid email or password', 401);
  }

  const matches = await bcrypt.compare(password, customer.password_hash);
  if (!matches) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken({ sub: customer.customer_id, role: 'customer', email: customer.email });
  return { customer: publicCustomer(customer), token };
}

module.exports = {
  register,
  login,
  publicCustomer
};
