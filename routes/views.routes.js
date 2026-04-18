const { Router } = require('express');

const router = Router();

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
