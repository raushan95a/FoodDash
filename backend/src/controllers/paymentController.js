const paymentService = require('../services/paymentService');

async function createPayment(req, res) {
  const data = await paymentService.upsertPayment(req.user.sub, req.body);
  res.status(201).json({ success: true, data });
}

module.exports = {
  createPayment
};
