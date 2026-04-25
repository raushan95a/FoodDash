const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const adminController = require('../controllers/adminController');
const { createRestaurantSchema } = require('../validators/restaurantValidators');
const {
  adminLoginSchema,
  userStatusSchema,
  restaurantStatusSchema,
  updateRestaurantSchema,
  updateOrderStatusSchema,
  deliveryAgentSchema,
  updateDeliveryAgentSchema
} = require('../validators/adminValidators');

const router = express.Router();

router.post('/auth/login', validate(adminLoginSchema), asyncHandler(adminController.login));

router.use(authenticate);
router.use(authorize('admin'));

router.get('/me', asyncHandler(adminController.me));
router.get('/dashboard', asyncHandler(adminController.dashboard));
router.get('/analytics', asyncHandler(adminController.analytics));

router.get('/users', asyncHandler(adminController.listUsers));
router.get('/users/:id', asyncHandler(adminController.getUser));
router.patch('/users/:id/status', validate(userStatusSchema), asyncHandler(adminController.updateUserStatus));
router.delete('/users/:id', asyncHandler(adminController.deleteUser));

router.get('/restaurants', asyncHandler(adminController.listRestaurants));
router.post('/restaurants', validate(createRestaurantSchema), asyncHandler(adminController.createRestaurant));
router.get('/restaurants/:id', asyncHandler(adminController.getRestaurant));
router.put('/restaurants/:id', validate(updateRestaurantSchema), asyncHandler(adminController.updateRestaurant));
router.patch('/restaurants/:id/approval', validate(restaurantStatusSchema), asyncHandler(adminController.updateRestaurantApproval));
router.delete('/restaurants/:id', asyncHandler(adminController.deleteRestaurant));

router.get('/orders', asyncHandler(adminController.listOrders));
router.get('/orders/:id', asyncHandler(adminController.getOrder));
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), asyncHandler(adminController.updateOrderStatus));

router.get('/delivery-agents', asyncHandler(adminController.listDeliveryAgents));
router.post('/delivery-agents', validate(deliveryAgentSchema), asyncHandler(adminController.createDeliveryAgent));
router.put('/delivery-agents/:id', validate(updateDeliveryAgentSchema), asyncHandler(adminController.updateDeliveryAgent));
router.delete('/delivery-agents/:id', asyncHandler(adminController.deleteDeliveryAgent));

module.exports = router;
