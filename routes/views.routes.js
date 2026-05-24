import { Router } from "express";
import * as commerceService from "../services/commerce.service.js";
import * as orderService from "../services/order.service.js";
import userService from "../services/user.service.js";
import transactionService from "../services/transaction.service.js";
import subscriptionService from '../services/subscription.service.js';
import * as storeService from '../services/store.service.js';
import { commerceNeedsSubscription, onlyPlatformAdmin } from '../middlewares/simulation.middleware.js';
import {
  clearAuthenticatedUser,
  ensureAuthenticated,
  ensureGuest,
  setAuthenticatedUser,
} from '../middlewares/auth.mittleware.js';

const router = Router();

const getDefaultRedirectByUser = user => {
  if (user?.role === 'commerce-admin' && !user.commerceId) {
    return '/commerce-admin/create';
  }

  return '/';
};

router.get('/', (req, res) => {
  res.render('home/index', { title: 'TechRetail', sim: res.locals.sim });
});

router.get('/auth/login', ensureGuest, async (req, res) => {
  res.render('auth/auth', {
    title: 'Iniciar sesión',
    mode: 'login',
    redirectTo: req.query.redirect || '/',
    sim: res.locals.sim,
  });
});

router.get('/auth/register', ensureGuest, async (req, res) => {
  res.render('auth/auth', {
    title: 'Crear cuenta',
    mode: 'register',
    redirectTo: req.query.redirect || '/',
    sim: res.locals.sim,
  });
});

router.post('/auth/login', ensureGuest, async (req, res) => {
  try {
    const { email = '', password = '', redirectTo = '/' } = req.body;
    const user = await userService.validateCredentials(email, password);

    if (!user) {
      return res.status(401).render('auth/auth', {
        title: 'Iniciar sesión',
        mode: 'login',
        redirectTo,
        error: 'Credenciales invalidas o usuario inactivo.',
        formData: { email },
        sim: res.locals.sim,
      });
    }

    setAuthenticatedUser(req, user);
    res.redirect(redirectTo && redirectTo !== '/' ? redirectTo : getDefaultRedirectByUser(user));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/auth/register', ensureGuest, async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      email,
      password,
      role,
      commerceId,
      redirectTo = '/',
    } = req.body;
    const commerces = await commerceService.getCommerce();

    if (!role) {
      role = 'commerce-admin';
    }

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).render('auth/auth', {
        title: 'Crear cuenta',
        mode: 'register',
        commerces,
        redirectTo,
        error: 'Completa todos los campos obligatorios.',
        formData: req.body,
        sim: res.locals.sim,
      });
    }

    if (await userService.existsByEmail(email)) {
      return res.status(400).render('auth/auth', {
        title: 'Crear cuenta',
        mode: 'register',
        commerces,
        redirectTo,
        error: 'Ya existe un usuario con ese email.',
        formData: req.body,
        sim: res.locals.sim,
      });
    }

    const user = await userService.createUser({
      firstName,
      lastName,
      email,
      password,
      role,
      commerceId: commerceId || null,
    });

    setAuthenticatedUser(req, user);
    res.redirect(redirectTo && redirectTo !== '/' ? redirectTo : getDefaultRedirectByUser(user));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/auth/logout', (req, res) => {
  clearAuthenticatedUser(req);
  res.redirect('/');
});

router.get('/commerce-admin/create', ensureAuthenticated, (req, res) => {
  const user = res.locals.currentUser;

  if (user?.role !== 'commerce-admin') {
    return res.redirect('/');
  }

  if (user.commerceId) {
    return res.redirect('/');
  }

  res.render('commerces/onboarding', {
    title: 'Crear mi comercio',
    user,
    sim: req.simulation,
  });
});

router.post('/commerce-admin/create', ensureAuthenticated, async (req, res) => {
  try {
    const user = res.locals.currentUser;

    if (user?.role !== 'commerce-admin') {
      return res.redirect('/');
    }

    if (user.commerceId) {
      return res.redirect('/');
    }

    const { name, cuit, phone, address } = req.body;

    if (!name || !cuit) {
      return res.status(400).render('commerces/onboarding', {
        title: 'Crear mi comercio',
        user,
        sim: req.simulation,
        error: 'La razon social y el CUIT son obligatorios.',
        formData: req.body,
      });
    }

    if (await commerceService.existsByCuit(cuit)) {
      return res.status(400).render('commerces/onboarding', {
        title: 'Crear mi comercio',
        user,
        sim: req.simulation,
        error: 'Ya existe un comercio con ese CUIT.',
        formData: req.body,
      });
    }

    const commerce = await commerceService.createCommerce({
      name,
      cuit,
      email: user.email,
      phone,
      address,
    });

    const updatedUser = await userService.assignCommerceToUser(user.email, commerce._id);
    setAuthenticatedUser(req, updatedUser);
    res.redirect('/commerce-admin/subscription?role=commerce-admin');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/commerce-admin/subscription', ensureAuthenticated, (req, res) => {
  res.render('subscriptions/gate', { title: 'Suscripcion', sim: res.locals.sim });
});

router.get('/commerces', ensureAuthenticated, onlyPlatformAdmin, async (req, res) => {
  const view = req.query.view || 'index';
  const commerces = await commerceService.getCommerce();
  res.render('commerces/index', { view, commerces, sim: req.simulation });
});

router.get('/orders', ensureAuthenticated, commerceNeedsSubscription, async (req, res) => {
  const view = req.query.view || 'index';
  const orders = await orderService.getOrders();
  res.render('orders/index', { view, orders, sim: req.simulation });
});

router.get('/orders/new', ensureAuthenticated, commerceNeedsSubscription, async (req, res) => {
  try {
    const users = await userService.getUsers();
    const stores = await storeService.getAllStores();
    res.render('orders/new', { users, stores, sim: req.simulation });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/orders/create', ensureAuthenticated, commerceNeedsSubscription, async (req, res) => {
  try {
    await orderService.createOrder(req.body);
    res.redirect(`/orders${req.simulation.query}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/orders/:id', ensureAuthenticated, commerceNeedsSubscription, async (req, res) => {
  const orders = await orderService.getOrders();
  const order = orders.find(o => o._id.toString() === req.params.id);
  res.render('orders/detail', { order, sim: req.simulation });
});

router.get('/stores', ensureAuthenticated, commerceNeedsSubscription, (req, res) => {
  res.render('stores/index', { sim: req.simulation });
});

router.get('/users', ensureAuthenticated, onlyPlatformAdmin, async (req, res) => {
  const users = await userService.getUsers();
  res.render('users/list', { users, sim: req.simulation });
});

router.get('/users/add', ensureAuthenticated, onlyPlatformAdmin, async (req, res) => {
  const commerces = await commerceService.getCommerce();
  res.render('users/add', { commerces, sim: req.simulation });
});

router.get('/users/edit/:email', ensureAuthenticated, onlyPlatformAdmin, async (req, res) => {
  const user = await userService.findByEmail(req.params.email);
  if (!user) return res.redirect(`/users${req.simulation.query}`);

  const commerces = await commerceService.getCommerce();
  res.render('users/edit', { user, commerces, sim: req.simulation });
});

router.get('/transactions', ensureAuthenticated, commerceNeedsSubscription, async (req, res) => {
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

router.get('/subscriptions', ensureAuthenticated, onlyPlatformAdmin, async (req, res) => {
  try {
    const data = await subscriptionService.getAll();
    res.render('subscriptions/index', { subscriptions: data || [], sim: req.simulation });
  } catch (error) {
    res.status(500).send('Error');
  }
});

router.get('/subscriptions/new', ensureAuthenticated, onlyPlatformAdmin, async (req, res) => {
  try {
    const stores = await storeService.getAllStores();
    res.render('subscriptions/new', { title: 'Nueva Suscripcion', stores, sim: req.simulation });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.post('/subscriptions/create', ensureAuthenticated, async (req, res) => {
  try {
    await subscriptionService.crear(req.body);
    res.redirect('/subscriptions?role=platform-admin');
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error al crear la suscripcion: ${error.message}`);
  }
});

router.get('/subscriptions/renew/:id', ensureAuthenticated, onlyPlatformAdmin, async (req, res) => {
  try {
    await subscriptionService.renovar(req.params.id);
    res.redirect('/subscriptions?role=platform-admin');
  } catch (error) {
    res.status(500).send(`Error al renovar: ${error.message}`);
  }
});

router.get('/subscriptions/cancel/:id', ensureAuthenticated, onlyPlatformAdmin, async (req, res) => {
  try {
    await subscriptionService.cancelar(req.params.id);
    res.redirect('/subscriptions?role=platform-admin');
  } catch (error) {
    res.status(500).send(`Error al cancelar: ${error.message}`);
  }
});

router.get('/subscriptions/delete/:id', ensureAuthenticated, onlyPlatformAdmin, async (req, res) => {
  try {
    await subscriptionService.eliminar(req.params.id);
    res.redirect('/subscriptions?role=platform-admin');
  } catch (error) {
    res.status(500).send(`Error al eliminar: ${error.message}`);
  }
});

export default router;
