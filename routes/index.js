const { Router } = require('express');
const userRoutes = require('./user.routes.js');
const commerceRoutes = require('./commerce.routes.js');
const viewRoutes = require('./views.routes.js');

const router = Router();

// Vistas
router.use('/', viewRoutes);

// API
router.use('/api/users', userRoutes);
router.use('/api/commerces', commerceRoutes);

module.exports = router;
