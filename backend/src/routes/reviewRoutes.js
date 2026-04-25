const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const reviewController = require('../controllers/reviewController');
const { createReviewSchema } = require('../validators/reviewValidators');

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorize('customer'),
  validate(createReviewSchema),
  asyncHandler(reviewController.createReview)
);

module.exports = router;
