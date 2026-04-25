const { query } = require('../database/connection');
const AppError = require('../utils/AppError');
const { publicCustomer } = require('./authService');

async function getProfile(customerId) {
  const [customer] = await query('SELECT * FROM customers WHERE customer_id = :customerId', {
    customerId
  });

  if (!customer) {
    throw new AppError('Customer not found', 404);
  }

  return publicCustomer(customer);
}

async function updateProfile(customerId, payload) {
  const allowed = ['phone', 'first_name', 'last_name', 'address', 'city', 'pincode'];
  const fields = allowed.filter((field) => Object.prototype.hasOwnProperty.call(payload, field));
  const params = { customerId };

  for (const field of fields) params[field] = payload[field];

  const result = await query(
    `UPDATE customers
     SET ${fields.map((field) => `${field} = :${field}`).join(', ')}
     WHERE customer_id = :customerId AND deleted_at IS NULL`,
    params
  );

  if (!result.affectedRows) throw new AppError('Customer not found', 404);
  return getProfile(customerId);
}

async function listAddresses(customerId) {
  return query(
    `SELECT address_id, label, address, city, pincode, is_default, created_at
     FROM customer_addresses
     WHERE customer_id = :customerId
     ORDER BY is_default DESC, created_at DESC`,
    { customerId }
  );
}

async function setDefaultAddress(customerId, addressId) {
  await query(
    'UPDATE customer_addresses SET is_default = FALSE WHERE customer_id = :customerId',
    { customerId }
  );

  const result = await query(
    'UPDATE customer_addresses SET is_default = TRUE WHERE customer_id = :customerId AND address_id = :addressId',
    { customerId, addressId }
  );

  if (!result.affectedRows) throw new AppError('Address not found', 404);
}

async function createAddress(customerId, payload) {
  if (payload.is_default) {
    await query('UPDATE customer_addresses SET is_default = FALSE WHERE customer_id = :customerId', { customerId });
  }

  const result = await query(
    `INSERT INTO customer_addresses (customer_id, label, address, city, pincode, is_default)
     VALUES (:customerId, :label, :address, :city, :pincode, :is_default)`,
    { customerId, ...payload }
  );

  if (payload.is_default) await updateProfile(customerId, payload);

  const [address] = await query(
    'SELECT * FROM customer_addresses WHERE customer_id = :customerId AND address_id = :addressId',
    { customerId, addressId: result.insertId }
  );
  return address;
}

async function updateAddress(customerId, addressId, payload) {
  if (payload.is_default) await setDefaultAddress(customerId, addressId);

  const allowed = ['label', 'address', 'city', 'pincode', 'is_default'];
  const fields = allowed.filter((field) => Object.prototype.hasOwnProperty.call(payload, field));
  const params = { customerId, addressId };
  for (const field of fields) params[field] = payload[field];

  const result = await query(
    `UPDATE customer_addresses
     SET ${fields.map((field) => `${field} = :${field}`).join(', ')}
     WHERE customer_id = :customerId AND address_id = :addressId`,
    params
  );

  if (!result.affectedRows) throw new AppError('Address not found', 404);

  const [address] = await query(
    'SELECT * FROM customer_addresses WHERE customer_id = :customerId AND address_id = :addressId',
    { customerId, addressId }
  );
  if (address.is_default) await updateProfile(customerId, address);
  return address;
}

async function deleteAddress(customerId, addressId) {
  const result = await query(
    'DELETE FROM customer_addresses WHERE customer_id = :customerId AND address_id = :addressId',
    { customerId, addressId }
  );

  if (!result.affectedRows) throw new AppError('Address not found', 404);
  return { address_id: addressId, deleted: true };
}

module.exports = {
  getProfile,
  updateProfile,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress
};
