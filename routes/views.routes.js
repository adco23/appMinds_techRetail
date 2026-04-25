const { Router } = require('express');
const { getCommerce } = require('../services/commerce.service.js');
const { getOrders } = require('../services/order.service.js');
const userService = require('../services/user.service.js');
const transactionService = require('../services/transaction.service.js');
const subscriptionService = require('../services/subscription.service.js');
const {
  requirePlatformAdmin,
  requireCommerceSubscription,
} = require('../middlewares/simulatedAccess.middleware.js');

const router = Router();

router.get('/', (req, res) => {
  res.render('home/index', {
    title: 'TechRetail',
    denied: req.query.denied || null,
  });
});

router.get('/simulation/login/:role', (req, res) => {
  const { role } = req.params;

  if (!['platform-admin', 'commerce-admin'].includes(role)) {
    return res.redirect('/');
  }

  res.cookie('simulatedRole', role, { httpOnly: false });
  res.cookie('subscriptionPaid', 'false', { httpOnly: false });

  if (role === 'commerce-admin') {
    return res.redirect('/commerce-admin/subscription');
  }

  return res.redirect('/');
});

router.get('/simulation/logout', (req, res) => {
  res.clearCookie('simulatedRole');
  res.clearCookie('subscriptionPaid');
  res.redirect('/');
});

router.get('/commerce-admin/subscription', (req, res) => {
  if (!req.simulatedUser.isCommerceAdmin) {
    return res.redirect('/?denied=commerce-admin-only');
  }

  res.render('subscriptions/gate', {
    title: 'Activar suscripcion',
    required: req.query.required === '1',
  });
});

router.post('/commerce-admin/subscription/pay', (req, res) => {
  if (!req.simulatedUser.isCommerceAdmin) {
    return res.redirect('/?denied=commerce-admin-only');
  }

  res.cookie('subscriptionPaid', 'true', { httpOnly: false });
  res.redirect('/');
});

router.get('/commerces', requirePlatformAdmin, (req, res) => {
  const view = req.query.view || 'index';

  res.render('commerces/index', { view, commerces: getCommerce() });
});

router.get('/orders', requireCommerceSubscription, (req, res) => {
  const view = req.query.view || 'index';
  const orders = getOrders();

  res.render('orders/index', { view, orders });
});

router.get('/orders/:id', requireCommerceSubscription, (req, res) => {
  const { id } = req.params;

  const order = getOrders().find(o => o.id === parseInt(id, 10));

  res.render('orders/detail', { order });
});

router.get('/stores', requireCommerceSubscription, (req, res) => {
  res.render('stores/index');
});

router.get('/users', requirePlatformAdmin, (req, res) => {
  const users = userService.getUsers();
  res.render('users/list', { users });
});

router.get('/users/add', requirePlatformAdmin, (req, res) => {
  res.render('users/add');
});

router.get('/users/edit/:email', requirePlatformAdmin, (req, res) => {
  const user = userService.findByEmail(req.params.email);
  if (!user) {
    return res.redirect('/users');
  }

  res.render('users/edit', { user });
});

router.get('/transactions', requireCommerceSubscription, async (req, res) => {
  try {
    const data = await transactionService.getAll();

    res.render('transactions/index', {
      title: 'TechRetail - Transacciones',
      transactions: data || [],
    });
  } catch (error) {
    console.error('Error loading transactions view:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/subscriptions', requirePlatformAdmin, async (req, res) => {
  try {
    const data = await subscriptionService.getAll();

    res.render('subscriptions/index', {
      subscriptions: data || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
});

router.get('/subscriptions/new', requirePlatformAdmin, (req, res) => {
  res.render('subscriptions/new', { title: 'Nueva Suscripcion' });
});

router.post('/subscriptions/create', requirePlatformAdmin, async (req, res) => {
  try {
    await subscriptionService.crear(req.body);
    res.redirect('/subscriptions');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear la suscripcion');
  }
});

router.get('/subscriptions/renew/:id', requirePlatformAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await subscriptionService.renovar(id);
    res.redirect('/subscriptions');
  } catch (error) {
    res.status(500).send(`Error al renovar: ${error.message}`);
  }
});

router.get('/subscriptions/cancel/:id', requirePlatformAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await subscriptionService.cancelar(id);
    res.redirect('/subscriptions');
  } catch (error) {
    res.status(500).send(`Error al cancelar: ${error.message}`);
  }
});

module.exports = router;
