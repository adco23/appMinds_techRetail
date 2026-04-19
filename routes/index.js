const { Router } = require('express');
const userRoutes = require('./user.routes.js');
const viewRoutes = require('./views.routes.js');

const router = Router();

// Vistas
router.use('/', viewRoutes);

// API
router.use('/api/user', userRoutes);

module.exports = router;
