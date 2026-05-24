import {  Router  } from "express";
const router = Router();
import subscriptionController from "../controllers/subscription.controller.js";

// Endpoints
router.get('/', subscriptionController.getAllSubscriptions);
router.post('/', subscriptionController.createSubscription);

export default router;
