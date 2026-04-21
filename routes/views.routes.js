const { Router } = require('express');

const router = Router();

const transactionService = require('../services/transaction.service.js')
const subscriptionService = require('../services/subscription.service.js');

router.get('/stores', (req, res) => {
  res.render('stores/index');
});

router.get('/users', (req, res) => {
  res.render('users/index');
});

router.get('/transactions', async (req, res) => {
  try {
    const data = await transactionService.getAll(); // Busca datos en JSON

    res.render('transactions/index', {
      title: 'TechRetail - Transacciones',
      transactions: data || [] // Envia datos a plantilla
    });
  } catch (error) {
    console.error("Error loading transactions view:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/subscriptions', async (req, res) => {
  try {
    const data = await subscriptionService.getAll();

    res.render('subscriptions/index', {
      subscriptions: data || []
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

// Ruta get para Crear nueva suscripción: formulario vacio
router.get('/subscriptions/new', (req, res) => {
    res.render('subscriptions/new', { title: 'Nueva Suscripción' });
});

// 2. Ruta post recibe datos y los guarda
router.post('/subscriptions/create', async (req, res) => {
    try {
        // datos desde formulario
        await subscriptionService.crear(req.body);

        // muestra en lista principal
        res.redirect('/subscriptions');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear la suscripción");
    }
});

// Ruta para Renovar por ID
router.get('/subscriptions/renew/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await subscriptionService.renovar(id);
        // Volvemos a la lista para ver el cambio
        res.redirect('/subscriptions');
    } catch (error) {
        res.status(500).send("Error al renovar: " + error.message);
    }
});

// Ruta para Cancelar por ID
router.get('/subscriptions/cancel/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await subscriptionService.cancelar(id);
        res.redirect('/subscriptions');
    } catch (error) {
        res.status(500).send("Error al cancelar: " + error.message);
    }
});

module.exports = router;
