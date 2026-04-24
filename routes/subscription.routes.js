const { Router } = require('express');
const router = Router();
const subscriptionController = require('../controllers/subscription.controller.js');


router.get('/', subscriptionController.getAllSubscriptions);
router.post('/', subscriptionController.createSubscription);
router.put('/renew/:id', subscriptionController.renewSubscription);
router.patch('/cancel/:id', subscriptionController.cancelSubscription);

module.exports = router;
