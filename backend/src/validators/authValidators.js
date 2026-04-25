const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(8).max(72).required(),
  phone: Joi.string().max(20).required(),
  first_name: Joi.string().max(50).required(),
  last_name: Joi.string().max(50).allow('', null),
  address: Joi.string().max(255).allow('', null),
  city: Joi.string().max(80).allow('', null),
  pincode: Joi.string().max(12).allow('', null)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  registerSchema,
  loginSchema
};
