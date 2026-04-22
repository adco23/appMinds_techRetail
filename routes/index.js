const { Router } = require('express');
const userRoutes = require('./user.routes');
const saleDetailRoutes = require('./saleDetail.routes'); // Nueva importación
const viewRoutes = require('./views.routes');

const router = Router();

// API
router.use('/api/users', userRoutes);
router.use('/api/sale-details', saleDetailRoutes); // Nueva ruta registrada

// Vistas
router.use('/', viewRoutes);

module.exports = router;
