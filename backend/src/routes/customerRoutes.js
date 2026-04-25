const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const customerController = require('../controllers/customerController');
const {
  updateProfileSchema,
  addressSchema,
  updateAddressSchema
} = require('../validators/customerValidators');

const router = express.Router();

router.use(authenticate);
router.use(authorize('customer'));

router.get('/me', asyncHandler(customerController.getMe));
router.put('/me', validate(updateProfileSchema), asyncHandler(customerController.updateMe));

router.get('/addresses', asyncHandler(customerController.listAddresses));
router.post('/addresses', validate(addressSchema), asyncHandler(customerController.createAddress));
router.put(
  '/addresses/:addressId',
  validate(updateAddressSchema),
  asyncHandler(customerController.updateAddress)
);
router.delete('/addresses/:addressId', asyncHandler(customerController.deleteAddress));

module.exports = router;
