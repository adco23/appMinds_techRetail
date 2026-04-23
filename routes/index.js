const { Router } = require('express');
const viewRoutes = require('./views.routes.js');
const commerceRoutes = require('./commerce.routes.js');
const orderRoutes = require('./order.routes.js');
const saleDetailRoutes = require('./saleDetail.routes');
const userRoutes = require('./user.routes.js');

const router = Router();

// Vistas
router.use('/', viewRoutes);

// API
router.use('/api/commerces', commerceRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/sale-details', saleDetailRoutes);
router.use('/api/users', userRoutes);

module.exports = router;
