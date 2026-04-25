const Joi = require('joi');

const createReviewSchema = Joi.object({
  restaurant_id: Joi.number().integer().positive().required(),
  order_id: Joi.number().integer().positive().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(1000).allow('', null)
});

module.exports = {
  createReviewSchema
};
