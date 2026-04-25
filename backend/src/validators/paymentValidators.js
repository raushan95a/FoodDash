const Joi = require('joi');

const createPaymentSchema = Joi.object({
  order_id: Joi.number().integer().positive().required(),
  payment_method: Joi.string().valid('card', 'upi', 'cash').required(),
  transaction_id: Joi.string().max(120).allow('', null),
  status: Joi.string().valid('pending', 'success', 'failed').default('pending')
});

module.exports = {
  createPaymentSchema
};
