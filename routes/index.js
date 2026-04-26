const { Router } = require('express');
const viewRoutes = require('./views.routes.js');
const commerceRoutes = require('./commerce.routes.js');
const orderRoutes = require('./order.routes.js');
const saleDetailRoutes = require('./saleDetail.routes');
const userRoutes = require('./user.routes.js');
const subscriptionRoutes = require('./subscription.routes.js');
const transactionRoutes = require('./transaction.routes.js');

const router = Router();

// Vistas
router.use('/', viewRoutes);

// API
router.use('/api/commerces', commerceRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/sale-details', saleDetailRoutes);
router.use('/api/users', userRoutes);
router.use('/api/subscriptions', subscriptionRoutes);
router.use('/api/transactions', transactionRoutes);

module.exports = router;
