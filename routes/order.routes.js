const { Router } = require('express');
const { getOrders, createOrder, updateOrder } = require('../controllers/order.controller.js');

const router = Router();

router.get('/', getOrders);
router.post('/', createOrder);
// router.put('/:cuit', updateCommerce);
router.put('/:id', updateOrder);

module.exports = router;
