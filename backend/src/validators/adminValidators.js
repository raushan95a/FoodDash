const Joi = require('joi');

const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const userStatusSchema = Joi.object({
  is_active: Joi.boolean().required()
});

const restaurantStatusSchema = Joi.object({
  is_approved: Joi.boolean().required()
});

const updateRestaurantSchema = Joi.object({
  name: Joi.string().max(120),
  owner_name: Joi.string().max(120),
  email: Joi.string().email().max(100),
  phone: Joi.string().max(20),
  address: Joi.string().max(255),
  city: Joi.string().max(80),
  pincode: Joi.string().max(12),
  cuisine_type: Joi.string().max(80),
  description: Joi.string().max(1000).allow('', null),
  delivery_fee: Joi.number().precision(2).min(0),
  is_open: Joi.boolean(),
  is_approved: Joi.boolean()
}).min(1);

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')
    .required(),
  delivery_agent_id: Joi.number().integer().positive().allow(null)
});

const deliveryAgentSchema = Joi.object({
  name: Joi.string().max(120).required(),
  email: Joi.string().email().max(100).required(),
  phone: Joi.string().max(20).required(),
  vehicle_type: Joi.string().valid('bike', 'scooter', 'cycle', 'car').default('bike'),
  license_number: Joi.string().max(60).required(),
  is_available: Joi.boolean().default(true),
  current_location: Joi.string().max(255).allow('', null)
});

const updateDeliveryAgentSchema = deliveryAgentSchema.fork(
  ['name', 'email', 'phone', 'license_number'],
  (schema) => schema.optional()
).min(1);

module.exports = {
  adminLoginSchema,
  userStatusSchema,
  restaurantStatusSchema,
  updateRestaurantSchema,
  updateOrderStatusSchema,
  deliveryAgentSchema,
  updateDeliveryAgentSchema
};
