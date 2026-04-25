const Joi = require('joi');

const updateProfileSchema = Joi.object({
  phone: Joi.string().max(20),
  first_name: Joi.string().max(50),
  last_name: Joi.string().max(50).allow('', null),
  address: Joi.string().max(255).allow('', null),
  city: Joi.string().max(80).allow('', null),
  pincode: Joi.string().max(12).allow('', null)
}).min(1);

const addressSchema = Joi.object({
  label: Joi.string().max(60).default('Home'),
  address: Joi.string().max(255).required(),
  city: Joi.string().max(80).allow('', null),
  pincode: Joi.string().max(12).allow('', null),
  is_default: Joi.boolean().default(false)
});

const updateAddressSchema = Joi.object({
  label: Joi.string().max(60),
  address: Joi.string().max(255),
  city: Joi.string().max(80).allow('', null),
  pincode: Joi.string().max(12).allow('', null),
  is_default: Joi.boolean()
}).min(1);

module.exports = {
  updateProfileSchema,
  addressSchema,
  updateAddressSchema
};
