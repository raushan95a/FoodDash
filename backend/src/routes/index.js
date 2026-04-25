const express = require('express');
const authRoutes = require('./authRoutes');
const customerRoutes = require('./customerRoutes');
const restaurantRoutes = require('./restaurantRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./paymentRoutes');
const reviewRoutes = require('./reviewRoutes');
const deliveryAgentRoutes = require('./deliveryAgentRoutes');
const adminRoutes = require('./adminRoutes');
const restaurantOwnerRoutes = require('./restaurantOwnerRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/delivery-agents', deliveryAgentRoutes);
router.use('/admin', adminRoutes);
router.use('/restaurant-owner', restaurantOwnerRoutes);

module.exports = router;
