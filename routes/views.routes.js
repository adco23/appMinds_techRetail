const { Router } = require('express');
const { getCommerce } = require('../services/commerce.service.js');
const { getOrders } = require('../services/order.service.js');
const userService = require('../services/user.service.js');

const router = Router();

router.get('/', (req, res) => {
  res.render('home/index');
});

router.get('/commerces', (req, res) => {
  const view = req.query.view || 'index';

  res.render('commerces/index', { view, commerces: getCommerce() });
});

router.get('/orders', (req, res) => {
  const view = req.query.view || 'index';
  const orders = getOrders();

  res.render('orders/index', { view, orders });
});

router.get('/orders/:id', (req, res) => {
  const { id } = req.params;

  const order = getOrders().find(o => o.id === parseInt(id));

  res.render('orders/detail', { order });
});

router.get('/stores', (req, res) => {
  res.render('stores/index');
});

router.get('/transactions', (req, res) => {
  res.render('transactions/index');
});

router.get('/users', (req, res) => {
  const users = userService.getUsers();
  res.render('users/list', { users });
});

router.get('/users/add', (req, res) => {
  res.render('users/add');
});

router.get('/users/edit/:email', (req, res) => {
  const user = userService.findByEmail(req.params.email);
  if (!user) {
    return res.redirect('/users');
  }
  res.render('users/edit', { user });
});

module.exports = router;
