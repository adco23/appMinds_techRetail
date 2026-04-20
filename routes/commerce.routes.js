const { Router } = require('express');
const { getCommerce, createCommerce } = require('../controllers/commerce.controller.js');

const router = Router();

router.get('/', getCommerce);
router.post('/', createCommerce);

module.exports = router;
