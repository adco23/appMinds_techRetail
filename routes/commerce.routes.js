const { Router } = require('express');
const {
  getCommerce,
  createCommerce,
  deleteCommerce,
  updateCommerce,
} = require('../controllers/commerce.controller.js');

const router = Router();

router.get('/:cuit', getCommerce);
router.post('/', createCommerce);
router.put('/:cuit', updateCommerce);
router.delete('/:cuit', deleteCommerce);

module.exports = router;
