const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const restaurantController = require('../controllers/restaurantController');
const { createRestaurantSchema } = require('../validators/restaurantValidators');

const router = express.Router();

router.get('/', asyncHandler(restaurantController.listRestaurants));
router.post('/', validate(createRestaurantSchema), asyncHandler(restaurantController.createRestaurant));
router.get('/:id', asyncHandler(restaurantController.getRestaurant));
router.get('/:id/menu', asyncHandler(restaurantController.getMenu));
router.get('/:id/reviews', asyncHandler(restaurantController.getReviews));

module.exports = router;
