const { Router } = require('express');
const { getCommerce } = require('../services/commerce.service.js');

const router = Router();

router.get('/', (req, res) => {
  res.render('home/index');
});

router.get('/commerces', (req, res) => {
  const view = req.query.view || 'index';

  res.render('commerces/index', { view, commerces: getCommerce() });
});

router.get('/stores', (req, res) => {
  res.render('stores/index');
});

router.get('/transactions', (req, res) => {
  res.render('transactions/index');
});

router.get('/users', (req, res) => {
  res.render('users/index');
});

module.exports = router;
