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
    const data = await transactionService.getAll(); // Buscamos los datos en el JSON

    res.render('transactions/index', {
      transactions: data || [] // Enviamos los datos a la plantilla
    });
  } catch (error) {
    console.error("Error loading transactions view:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/subscriptions', async (req, res) => {
  try {
    const data = await subscriptionService.getAll();

    // ESTO VA A APARECER EN LA TERMINAL DE VS CODE
    console.log("¿Qué leyó el servidor?:", data);


    res.render('subscriptions/index', {
      subscriptions: data || []
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

module.exports = router;
