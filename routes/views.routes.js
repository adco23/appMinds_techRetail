import { Router } from "express";
import * as commerceService from "../services/commerce.service.js";
import * as orderService from "../services/order.service.js";
import userService from "../services/user.service.js";
import transactionService from "../services/transaction.service.js";
import subscriptionService from '../services/subscription.service.js';
import * as storeService from '../services/store.service.js';
import * as planService from '../services/plan.service.js';


const router = Router();

const getSimulationData = req => {
  if (req.res && req.res.locals && req.res.locals.sim) {
    return req.res.locals.sim;
  }
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
  if (!sim.isPlatformAdmin) return res.redirect('/');
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
  res.render('home/index', { title: 'TechRetail', sim: res.locals.sim });
});

router.get('/commerce-admin/subscription', async (req, res) => {
  const planes = await planService.getPlanes();
  res.render('subscriptions/gate', { title: 'Suscripcion', planes, sim: res.locals.sim });
});

router.get('/commerce-admin/subscription/tienda', async (req, res) => {
  const { planId } = req.query;
  const plan = await planService.getPlanById(planId);
  if (!plan) return res.redirect('/commerce-admin/subscription?role=commerce-admin');

  const stores = await storeService.getAllStores();
  res.render('subscriptions/elegir-tienda', { plan, stores, sim: res.locals.sim });
});

router.post('/commerce-admin/subscription/crear', async (req, res) => {
  try {
    const { planId, storeId } = req.body;
    const plan = await planService.getPlanById(planId);
    if (!plan) throw new Error('Plan no encontrado');

    await subscriptionService.crear({
      detail:  plan.name,
      amount:  Number(plan.precio),
      storeId,
    });

    res.redirect('/?role=commerce-admin&subscribed=1');
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
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
    const planes = await planService.getPlanes();
    res.render('subscriptions/index', { subscriptions: data || [], planes, sim: req.simulation });
  } catch (error) {
    res.status(500).send('Error');
  }
});

router.get('/subscriptions/new', onlyPlatformAdmin, async (req, res) => {
  try {
    const stores = await storeService.getAllStores();
    const planes = await planService.getPlanes();
    const planId = req.query.planId || null;
    res.render('subscriptions/new', { title: 'Nueva Suscripcion', stores, planes, planId, sim: req.simulation });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/planes/new', onlyPlatformAdmin, async (req, res) => {
  res.render('subscriptions/new-plan', { sim: req.simulation });
});

router.post('/planes/create', onlyPlatformAdmin, async (req, res) => {
  try {
    await planService.createPlan(req.body);
    res.redirect('/subscriptions?role=platform-admin');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/planes/edit/:id', onlyPlatformAdmin, async (req, res) => {
  try {
    const plan = await planService.getPlanById(req.params.id);
    res.render('subscriptions/edit-plan', { plan, sim: req.simulation });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/planes/edit/:id', onlyPlatformAdmin, async (req, res) => {
  try {
    await planService.updatePlan(req.params.id, req.body);
    res.redirect('/subscriptions?role=platform-admin');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/planes/delete/:id', onlyPlatformAdmin, async (req, res) => {
  try {
    await planService.deletePlan(req.params.id);
    res.redirect('/subscriptions?role=platform-admin');
  } catch (error) {
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
