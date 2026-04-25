const deliveryAgentService = require('../services/deliveryAgentService');

async function listDeliveryAgents(_req, res) {
  const data = await deliveryAgentService.listDeliveryAgents();
  res.json({ success: true, data });
}

module.exports = {
  listDeliveryAgents
};
