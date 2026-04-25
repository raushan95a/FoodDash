const orderService = require('../services/orderService');

async function createOrder(req, res) {
  const data = await orderService.createOrder(req.user.sub, req.body);
  res.status(201).json({ success: true, data });
}

async function listMyOrders(req, res) {
  const data = await orderService.listCustomerOrders(req.user.sub);
  res.json({ success: true, data });
}

async function getOrder(req, res) {
  const data = await orderService.getOrderById(Number(req.params.id), req.user.sub);
  res.json({ success: true, data });
}

async function updateStatus(req, res) {
  const data = await orderService.updateOrderStatus(Number(req.params.id), req.body);
  res.json({ success: true, data });
}

module.exports = {
  createOrder,
  listMyOrders,
  getOrder,
  updateStatus
};
