const { Router } = require('express');
const { getCommerce } = require('../services/commerce.service.js');
const { getOrders } = require('../services/order.service.js');
const userService = require('../services/user.service.js');
const transactionService = require('../services/transaction.service.js');
const subscriptionService = require('../services/subscription.service.js');

const router = Router();

const getSimulationData = req => {
  const role = req.query.role || '';
  const subscribed = req.query.subscribed === '1';

  return {
    role,
    subscribed,
    isPlatformAdmin: role === 'platform-admin',
    isCommerceAdmin: role === 'commerce-admin',
    query: role ? `?role=${role}${subscribed ? '&subscribed=1' : ''}` : '',
  };
};

const onlyPlatformAdmin = (req, res, next) => {
  const sim = getSimulationData(req);

  if (!sim.isPlatformAdmin) {
    return res.redirect('/');
  }

  req.simulation = sim;
  next();
};

const commerceNeedsSubscription = (req, res, next) => {
  const sim = getSimulationData(req);

  if (sim.isCommerceAdmin && !sim.subscribed) {
    return res.redirect('/commerce-admin/subscription?role=commerce-admin');
  }

  req.simulation = sim;
  next();
};

router.get('/', (req, res) => {
  res.render('home/index', {
    title: 'TechRetail',
    sim: getSimulationData(req),
  });
});

router.get('/commerce-admin/subscription', (req, res) => {
  const sim = getSimulationData(req);

  res.render('subscriptions/gate', {
    title: 'Suscripcion',
    sim,
  });
});

router.get('/commerces', onlyPlatformAdmin, (req, res) => {
  const view = req.query.view || 'index';
  res.render('commerces/index', { view, commerces: getCommerce(), sim: req.simulation });
});

router.get('/orders', commerceNeedsSubscription, (req, res) => {
  const view = req.query.view || 'index';
  const orders = getOrders();
  res.render('orders/index', { view, orders, sim: req.simulation });
});

router.get('/orders/:id', commerceNeedsSubscription, (req, res) => {
  const order = getOrders().find(o => o.id === parseInt(req.params.id, 10));
  res.render('orders/detail', { order, sim: req.simulation });
});

router.get('/stores', commerceNeedsSubscription, (req, res) => {
  res.render('stores/index', { sim: req.simulation });
});

router.get('/users', onlyPlatformAdmin, (req, res) => {
  const users = userService.getUsers();
  res.render('users/list', { users, sim: req.simulation });
});

router.get('/users/add', onlyPlatformAdmin, (req, res) => {
  res.render('users/add', { sim: req.simulation });
});

router.get('/users/edit/:email', onlyPlatformAdmin, (req, res) => {
  const user = userService.findByEmail(req.params.email);
  if (!user) {
    return res.redirect(`/users${req.simulation.query}`);
  }

  res.render('users/edit', { user, sim: req.simulation });
});

router.get('/transactions', commerceNeedsSubscription, async (req, res) => {
  try {
    const data = await transactionService.getAll();
    res.render('transactions/index', {
      title: 'TechRetail - Transacciones',
      transactions: data || [],
      sim: req.simulation,
    });
  } catch (error) {
    console.error('Error loading transactions view:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/subscriptions', onlyPlatformAdmin, async (req, res) => {
  try {
    const data = await subscriptionService.getAll();
    res.render('subscriptions/index', {
      subscriptions: data || [],
      sim: req.simulation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
});

router.get('/subscriptions/new', onlyPlatformAdmin, (req, res) => {
  res.render('subscriptions/new', { title: 'Nueva Suscripcion', sim: req.simulation });
});

router.post('/subscriptions/create', async (req, res) => {
  try {
    await subscriptionService.crear(req.body);
    res.redirect('/subscriptions?role=platform-admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear la suscripcion');
  }
});

router.get('/subscriptions/renew/:id', onlyPlatformAdmin, async (req, res) => {
  try {
    await subscriptionService.renovar(req.params.id);
    res.redirect('/subscriptions?role=platform-admin');
  } catch (error) {
    res.status(500).send(`Error al renovar: ${error.message}`);
  }
});

router.get('/subscriptions/cancel/:id', onlyPlatformAdmin, async (req, res) => {
  try {
    await subscriptionService.cancelar(req.params.id);
    res.redirect('/subscriptions?role=platform-admin');
  } catch (error) {
    res.status(500).send(`Error al cancelar: ${error.message}`);
  }
});

module.exports = router;
