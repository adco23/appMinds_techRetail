const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/registro', userController.registro);
router.post('/registro', userController.store);
router.get('/', userController.list);
router.get('/:id', userController.show);

router.get('/editar/:id', userController.edit);
router.post('/editar/:id', userController.update);
router.post('/borrar/:id', userController.delete);
router.post('/activar/:id', userController.activate);

module.exports = router;
