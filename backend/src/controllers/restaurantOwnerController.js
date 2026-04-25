const restaurantOwnerService = require('../services/restaurantOwnerService');

async function login(req, res) {
  const data = await restaurantOwnerService.login(req.body.email, req.body.password);
  res.json({ success: true, data });
}

async function me(req, res) {
  const data = await restaurantOwnerService.getMe(req.user.sub);
  res.json({ success: true, data });
}

async function dashboard(req, res) {
  const data = await restaurantOwnerService.getDashboard(req.user.sub);
  res.json({ success: true, data });
}

async function updateProfile(req, res) {
  const data = await restaurantOwnerService.updateProfile(req.user.sub, req.body);
  res.json({ success: true, data });
}

async function listMenu(req, res) {
  const data = await restaurantOwnerService.listMenu(req.user.sub);
  res.json({ success: true, data });
}

async function createMenuItem(req, res) {
  const data = await restaurantOwnerService.createMenuItem(req.user.sub, req.body);
  res.status(201).json({ success: true, data });
}

async function updateMenuItem(req, res) {
  const data = await restaurantOwnerService.updateMenuItem(
    req.user.sub,
    Number(req.params.itemId),
    req.body
  );
  res.json({ success: true, data });
}

async function deleteMenuItem(req, res) {
  const data = await restaurantOwnerService.deleteMenuItem(req.user.sub, Number(req.params.itemId));
  res.json({ success: true, data });
}

async function listOrders(req, res) {
  const data = await restaurantOwnerService.listOrders(req.user.sub, req.query);
  res.json({ success: true, data });
}

async function getOrder(req, res) {
  const data = await restaurantOwnerService.getOrder(req.user.sub, Number(req.params.orderId));
  res.json({ success: true, data });
}

async function updateOrderStatus(req, res) {
  const data = await restaurantOwnerService.updateOrderStatus(
    req.user.sub,
    Number(req.params.orderId),
    req.body.status
  );
  res.json({ success: true, data });
}

module.exports = {
  login,
  me,
  dashboard,
  updateProfile,
  listMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  listOrders,
  getOrder,
  updateOrderStatus
};
