const adminService = require('../services/adminService');

async function login(req, res) {
  const data = await adminService.login(req.body.email, req.body.password);
  res.json({ success: true, data });
}

async function me(req, res) {
  const data = await adminService.getMe(req.user.sub);
  res.json({ success: true, data });
}

async function dashboard(_req, res) {
  const data = await adminService.getDashboard();
  res.json({ success: true, data });
}

async function analytics(_req, res) {
  const data = await adminService.getAnalytics();
  res.json({ success: true, data });
}

async function listUsers(req, res) {
  const data = await adminService.listUsers(req.query);
  res.json({ success: true, ...data });
}

async function getUser(req, res) {
  const data = await adminService.getUserDetails(Number(req.params.id));
  res.json({ success: true, data });
}

async function updateUserStatus(req, res) {
  const data = await adminService.setUserStatus(Number(req.params.id), req.body.is_active);
  res.json({ success: true, data });
}

async function deleteUser(req, res) {
  const data = await adminService.deleteUser(Number(req.params.id));
  res.json({ success: true, data });
}

async function listRestaurants(req, res) {
  const data = await adminService.listRestaurants(req.query);
  res.json({ success: true, ...data });
}

async function getRestaurant(req, res) {
  const data = await adminService.getRestaurant(Number(req.params.id));
  res.json({ success: true, data });
}

async function createRestaurant(req, res) {
  const data = await adminService.createRestaurant(req.body);
  res.status(201).json({ success: true, data });
}

async function updateRestaurant(req, res) {
  const data = await adminService.updateRestaurant(Number(req.params.id), req.body);
  res.json({ success: true, data });
}

async function updateRestaurantApproval(req, res) {
  const data = await adminService.setRestaurantApproval(Number(req.params.id), req.body.is_approved);
  res.json({ success: true, data });
}

async function deleteRestaurant(req, res) {
  const data = await adminService.deleteRestaurant(Number(req.params.id));
  res.json({ success: true, data });
}

async function listOrders(req, res) {
  const data = await adminService.listOrders(req.query);
  res.json({ success: true, ...data });
}

async function getOrder(req, res) {
  const data = await adminService.getOrder(Number(req.params.id));
  res.json({ success: true, data });
}

async function updateOrderStatus(req, res) {
  const data = await adminService.updateOrderStatus(Number(req.params.id), req.body);
  res.json({ success: true, data });
}

async function listDeliveryAgents(req, res) {
  const data = await adminService.listDeliveryAgents(req.query);
  res.json({ success: true, ...data });
}

async function createDeliveryAgent(req, res) {
  const data = await adminService.createDeliveryAgent(req.body);
  res.status(201).json({ success: true, data });
}

async function updateDeliveryAgent(req, res) {
  const data = await adminService.updateDeliveryAgent(Number(req.params.id), req.body);
  res.json({ success: true, data });
}

async function deleteDeliveryAgent(req, res) {
  const data = await adminService.deleteDeliveryAgent(Number(req.params.id));
  res.json({ success: true, data });
}

module.exports = {
  login,
  me,
  dashboard,
  analytics,
  listUsers,
  getUser,
  updateUserStatus,
  deleteUser,
  listRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  updateRestaurantApproval,
  deleteRestaurant,
  listOrders,
  getOrder,
  updateOrderStatus,
  listDeliveryAgents,
  createDeliveryAgent,
  updateDeliveryAgent,
  deleteDeliveryAgent
};
