const Joi = require('joi');

const restaurantLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateRestaurantProfileSchema = Joi.object({
  name: Joi.string().max(120),
  owner_name: Joi.string().max(120),
  phone: Joi.string().max(20),
  address: Joi.string().max(255),
  city: Joi.string().max(80),
  pincode: Joi.string().max(12),
  cuisine_type: Joi.string().max(80),
  description: Joi.string().max(1000).allow('', null),
  delivery_fee: Joi.number().precision(2).min(0),
  is_open: Joi.boolean()
}).min(1);

const menuItemSchema = Joi.object({
  item_name: Joi.string().max(120).required(),
  description: Joi.string().max(1000).allow('', null),
  price: Joi.number().precision(2).min(0).required(),
  category: Joi.string().valid('veg', 'non-veg', 'sides', 'dessert', 'beverage').required(),
  image_url: Joi.string().uri().allow('', null),
  is_veg: Joi.boolean().required(),
  is_available: Joi.boolean().default(true)
});

const updateMenuItemSchema = menuItemSchema.fork(
  ['item_name', 'price', 'category', 'is_veg'],
  (schema) => schema.optional()
).min(1);

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('confirmed', 'preparing', 'ready', 'cancelled').required()
});

module.exports = {
  restaurantLoginSchema,
  updateRestaurantProfileSchema,
  menuItemSchema,
  updateMenuItemSchema,
  updateOrderStatusSchema
};
