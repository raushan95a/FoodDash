const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const paymentController = require('../controllers/paymentController');
const { createPaymentSchema } = require('../validators/paymentValidators');

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorize('customer'),
  validate(createPaymentSchema),
  asyncHandler(paymentController.createPayment)
);

module.exports = router;
