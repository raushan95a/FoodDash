const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const orderController = require('../controllers/orderController');
const { createOrderSchema } = require('../validators/orderValidators');

const router = express.Router();

router.use(authenticate);
router.use(authorize('customer'));

router.post('/', validate(createOrderSchema), asyncHandler(orderController.createOrder));
router.get('/my-orders', asyncHandler(orderController.listMyOrders));
router.get('/:id', asyncHandler(orderController.getOrder));

module.exports = router;
