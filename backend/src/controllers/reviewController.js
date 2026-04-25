const reviewService = require('../services/reviewService');

async function createReview(req, res) {
  const data = await reviewService.createReview(req.user.sub, req.body);
  res.status(201).json({ success: true, data });
}

module.exports = {
  createReview
};
