import { Router } from "express";
import * as commerceService from "../services/commerce.service.js";
import * as orderService from "../services/order.service.js";
import userService from "../services/user.service.js";
import transactionService from "../services/transaction.service.js";
import subscriptionService from '../services/subscription.service.js';
import * as storeService from '../services/store.service.js';
import { commerceNeedsSubscription, onlyPlatformAdmin } from '../middlewares/simulation.middleware.js';

const router = Router();

router.get('/', (req, res) => {
  res.render('home/index', { title: 'TechRetail', sim: res.locals.sim });
});

router.get('/commerce-admin/subscription', (req, res) => {
  res.render('subscriptions/gate', { title: 'Suscripcion', sim: res.locals.sim });
});

router.get('/commerces', onlyPlatformAdmin, async (req, res) => {
  const view = req.query.view || 'index';
  const commerces = await commerceService.getCommerce();
  res.render('commerces/index', { view, commerces, sim: req.simulation });
});

router.get('/orders', commerceNeedsSubscription, async (req, res) => {
  const view = req.query.view || 'index';
  const orders = await orderService.getOrders();
  res.render('orders/index', { view, orders, sim: req.simulation });
});

router.get('/orders/new', commerceNeedsSubscription, async (req, res) => {
  try {
    const users = await userService.getUsers();
    const stores = await storeService.getAllStores();
    res.render('orders/new', { users, stores, sim: req.simulation });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/orders/create', commerceNeedsSubscription, async (req, res) => {
  try {
    await orderService.createOrder(req.body);
    res.redirect(`/orders${req.simulation.query}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/orders/:id', commerceNeedsSubscription, async (req, res) => {
  const orders = await orderService.getOrders();
  const order = orders.find(o => o._id.toString() === req.params.id);
  res.render('orders/detail', { order, sim: req.simulation });
});

router.get('/stores', commerceNeedsSubscription, (req, res) => {
  res.render('stores/index', { sim: req.simulation });
});

router.get('/users', onlyPlatformAdmin, async (req, res) => {
  const users = await userService.getUsers();
  res.render('users/list', { users, sim: req.simulation });
});

router.get('/users/add', onlyPlatformAdmin, async (req, res) => {
  const commerces = await commerceService.getCommerce();
  res.render('users/add', { commerces, sim: req.simulation });
});

router.get('/users/edit/:email', onlyPlatformAdmin, async (req, res) => {
  const user = await userService.findByEmail(req.params.email);
  if (!user) return res.redirect(`/users${req.simulation.query}`);

  const commerces = await commerceService.getCommerce();
  res.render('users/edit', { user, commerces, sim: req.simulation });
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
    res.status(500).send('Internal Server Error');
  }
});

router.get('/subscriptions', onlyPlatformAdmin, async (req, res) => {
  try {
    const data = await subscriptionService.getAll();
    res.render('subscriptions/index', { subscriptions: data || [], sim: req.simulation });
  } catch (error) {
    res.status(500).send('Error');
  }
});

router.get('/subscriptions/new', onlyPlatformAdmin, async (req, res) => {
  try {
    const stores = await storeService.getAllStores();
    res.render('subscriptions/new', { title: 'Nueva Suscripcion', stores, sim: req.simulation });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.post('/subscriptions/create', async (req, res) => {
  try {
    await subscriptionService.crear(req.body);
    res.redirect('/subscriptions?role=platform-admin');
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error al crear la suscripcion: ${error.message}`);
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

router.get('/subscriptions/delete/:id', onlyPlatformAdmin, async (req, res) => {
  try {
    await subscriptionService.eliminar(req.params.id);
    res.redirect('/subscriptions?role=platform-admin');
  } catch (error) {
    res.status(500).send(`Error al eliminar: ${error.message}`);
  }
});



export default router;
