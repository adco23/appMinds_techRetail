const { Router } = require('express');
const viewRoutes = require('./views.routes.js');
const userRoutes = require('./user.routes.js');
const commerceRoutes = require('./commerce.routes.js');
const saleRoutes = require('./sale.routes.js');

const router = Router();

// Vistas
router.use('/', viewRoutes);

// API
router.use('/api/users', userRoutes);
router.use('/api/commerces', commerceRoutes);
router.use('/api/sales', saleRoutes);

module.exports = router;
