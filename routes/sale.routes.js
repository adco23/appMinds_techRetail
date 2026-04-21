const { Router } = require('express');
const { getSales, createSale, cancelSale } = require('../controllers/sale.controller.js');

const router = Router();

router.get('/', getSales);
router.post('/', createSale);
// router.put('/:cuit', updateCommerce);
router.put('/:id', cancelSale);

module.exports = router;
