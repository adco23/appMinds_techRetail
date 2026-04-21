const { Router } = require('express');
const userRoutes = require('./user.routes.js');
const viewRoutes = require('./views.routes.js');
const subscriptionRoutes = require('./subscription.routes.js');
const transactionRoutes = require('./transaction.routes.js');

const router = Router();

router.get('/', (req, res) => {
    res.send('¡Servidor funcionando! Estás viendo la ruta de vistas.');
});

// Vistas
router.use('/', viewRoutes);

// API
router.use('/api/users', userRoutes);
router.use('/api/subscriptions', subscriptionRoutes);
router.use('/api/transactions', transactionRoutes);

module.exports = router;
