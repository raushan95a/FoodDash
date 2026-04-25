const Joi = require('joi');

const createRestaurantSchema = Joi.object({
  name: Joi.string().max(120).required(),
  owner_name: Joi.string().max(120).required(),
  email: Joi.string().email().max(100).required(),
  phone: Joi.string().max(20).required(),
  address: Joi.string().max(255).required(),
  city: Joi.string().max(80).required(),
  pincode: Joi.string().max(12).required(),
  cuisine_type: Joi.string().max(80).required(),
  owner_password: Joi.string().min(8).max(72).allow('', null),
  description: Joi.string().max(1000).allow('', null),
  delivery_fee: Joi.number().precision(2).min(0).default(0)
});

const createMenuItemSchema = Joi.object({
  item_name: Joi.string().max(120).required(),
  description: Joi.string().max(1000).allow('', null),
  price: Joi.number().precision(2).min(0).required(),
  category: Joi.string().valid('veg', 'non-veg', 'sides', 'dessert', 'beverage').required(),
  image_url: Joi.string().uri().allow('', null),
  is_veg: Joi.boolean().required(),
  is_available: Joi.boolean().default(true)
});

module.exports = {
  createRestaurantSchema,
  createMenuItemSchema
};
