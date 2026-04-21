const { Router } = require('express');
const router = Router();
const subscriptionController = require('../controllers/subscription.controller.js');

// Endpoints
router.get('/', subscriptionController.getAllSubscriptions);
router.post('/', subscriptionController.createSubscription);

module.exports = router;
