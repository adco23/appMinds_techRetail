const { Router } = require('express');
const userService = require('../services/user.service.js');

const router = Router();

router.get('/', (req, res) => {
  res.render('home/index');
});

router.get('/commerces', (req, res) => {
  res.render('commerces/index', { view: 'list', commerces: [] });
});

router.get('/stores', (req, res) => {
  res.render('stores/index');
});

router.get('/transactions', (req, res) => {
  res.render('transactions/index');
});

router.get('/users', (req, res) => {
  try {
    const allUsers = userService.getUsers();
    res.render('users/list', {
      users: allUsers,
      title: 'Gestión de Usuarios'
    });
  } catch (error) {
    console.error("Error al cargar la vista de usuarios:", error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;
