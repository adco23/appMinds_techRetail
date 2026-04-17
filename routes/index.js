const { Router } = require('express');
const userRoutes = require('./user.routes.js');
const viewRoutes = require('./views.routes.js');

const router = Router();

// API
router.use('/users', userRoutes);

// Vistas
router.get('/', viewRoutes);

module.exports = router;
