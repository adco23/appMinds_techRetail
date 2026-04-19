const express = require('express');
const router = express.Router();
const saleDetailController = require('../controllers/saleDetail.controller');

router.get('/registro', saleDetailController.registro);
router.post('/registro', saleDetailController.store);
router.get('/', saleDetailController.list);
router.get('/:id', saleDetailController.show);
router.get('/editar/:id', saleDetailController.edit);
router.post('/editar/:id', saleDetailController.update);
router.post('/borrar/:id', saleDetailController.delete);

module.exports = router;
