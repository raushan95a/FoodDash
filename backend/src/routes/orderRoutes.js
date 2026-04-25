const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const orderController = require('../controllers/orderController');
const { createOrderSchema, updateOrderStatusSchema } = require('../validators/orderValidators');

const router = express.Router();

router.post('/', authenticate, validate(createOrderSchema), asyncHandler(orderController.createOrder));
router.get('/my-orders', authenticate, asyncHandler(orderController.listMyOrders));
router.get('/:id', authenticate, asyncHandler(orderController.getOrder));
router.patch('/:id/status', validate(updateOrderStatusSchema), asyncHandler(orderController.updateStatus));

module.exports = router;
