const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const customerController = require('../controllers/customerController');
const {
  updateProfileSchema,
  addressSchema,
  updateAddressSchema
} = require('../validators/customerValidators');

const router = express.Router();

router.get('/me', authenticate, asyncHandler(customerController.getMe));
router.put('/me', authenticate, validate(updateProfileSchema), asyncHandler(customerController.updateMe));

router.get('/addresses', authenticate, asyncHandler(customerController.listAddresses));
router.post('/addresses', authenticate, validate(addressSchema), asyncHandler(customerController.createAddress));
router.put(
  '/addresses/:addressId',
  authenticate,
  validate(updateAddressSchema),
  asyncHandler(customerController.updateAddress)
);
router.delete('/addresses/:addressId', authenticate, asyncHandler(customerController.deleteAddress));

module.exports = router;
