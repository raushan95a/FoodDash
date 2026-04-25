const customerService = require('../services/customerService');

async function getMe(req, res) {
  const data = await customerService.getProfile(req.user.sub);
  res.json({ success: true, data });
}

async function updateMe(req, res) {
  const data = await customerService.updateProfile(req.user.sub, req.body);
  res.json({ success: true, data });
}

async function listAddresses(req, res) {
  const data = await customerService.listAddresses(req.user.sub);
  res.json({ success: true, data });
}

async function createAddress(req, res) {
  const data = await customerService.createAddress(req.user.sub, req.body);
  res.status(201).json({ success: true, data });
}

async function updateAddress(req, res) {
  const data = await customerService.updateAddress(req.user.sub, Number(req.params.addressId), req.body);
  res.json({ success: true, data });
}

async function deleteAddress(req, res) {
  const data = await customerService.deleteAddress(req.user.sub, Number(req.params.addressId));
  res.json({ success: true, data });
}

module.exports = {
  getMe,
  updateMe,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress
};
