const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const deliveryAgentController = require('../controllers/deliveryAgentController');

const router = express.Router();

router.get('/', asyncHandler(deliveryAgentController.listDeliveryAgents));

module.exports = router;
