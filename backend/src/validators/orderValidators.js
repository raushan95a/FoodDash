const Joi = require('joi');

const createOrderSchema = Joi.object({
  restaurant_id: Joi.number().integer().positive().required(),
  delivery_address: Joi.string().max(255).required(),
  special_instructions: Joi.string().max(1000).allow('', null),
  payment_method: Joi.string().valid('card', 'upi', 'cash').required(),
  items: Joi.array().items(
    Joi.object({
      item_id: Joi.number().integer().positive().required(),
      quantity: Joi.number().integer().min(1).max(50).required(),
      special_instructions: Joi.string().max(500).allow('', null)
    })
  ).min(1).required()
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')
    .required(),
  delivery_agent_id: Joi.number().integer().positive().allow(null)
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema
};
