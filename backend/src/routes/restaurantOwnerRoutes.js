const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const restaurantOwnerController = require('../controllers/restaurantOwnerController');
const {
  restaurantLoginSchema,
  updateRestaurantProfileSchema,
  menuItemSchema,
  updateMenuItemSchema,
  updateOrderStatusSchema
} = require('../validators/restaurantOwnerValidators');

const router = express.Router();

router.post('/auth/login', validate(restaurantLoginSchema), asyncHandler(restaurantOwnerController.login));

router.use(authenticate);
router.use(authorize('restaurant'));

router.get('/me', asyncHandler(restaurantOwnerController.me));
router.get('/dashboard', asyncHandler(restaurantOwnerController.dashboard));
router.put('/profile', validate(updateRestaurantProfileSchema), asyncHandler(restaurantOwnerController.updateProfile));

router.get('/menu', asyncHandler(restaurantOwnerController.listMenu));
router.post('/menu', validate(menuItemSchema), asyncHandler(restaurantOwnerController.createMenuItem));
router.put('/menu/:itemId', validate(updateMenuItemSchema), asyncHandler(restaurantOwnerController.updateMenuItem));
router.delete('/menu/:itemId', asyncHandler(restaurantOwnerController.deleteMenuItem));

router.get('/orders', asyncHandler(restaurantOwnerController.listOrders));
router.get('/orders/:orderId', asyncHandler(restaurantOwnerController.getOrder));
router.patch('/orders/:orderId/status', validate(updateOrderStatusSchema), asyncHandler(restaurantOwnerController.updateOrderStatus));

module.exports = router;
