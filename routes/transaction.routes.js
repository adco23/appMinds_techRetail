const { Router } = require('express');
const router = Router();
const transactionController = require('../controllers/transaction.controller.js');


router.post('/', transactionController.create);
router.get('/', transactionController.getAll);

module.exports = router;
