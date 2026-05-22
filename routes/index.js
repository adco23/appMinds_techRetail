import {  Router  } from "express";
import viewRoutes from "./views.routes.js";
import commerceRoutes from "./commerce.routes.js";
import orderRoutes from "./order.routes.js";
import saleDetailRoutes from "./saleDetail.routes.js";
import userRoutes from "./user.routes.js";
import subscriptionRoutes from "./subscription.routes.js";
import transactionRoutes from "./transaction.routes.js";
import storeRoutes from "./store.routes.js";
import productRoutes from "./product.routes.js";

const router = Router();


// Vistas
router.use('/', viewRoutes);

// API
router.use('/api/commerces', commerceRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/sale-details', saleDetailRoutes);
router.use('/api/users', userRoutes);
router.use('/api/subscriptions', subscriptionRoutes);
router.use('/api/transactions', transactionRoutes);
router.use('/api/stores', storeRoutes);
router.use('/api/products', productRoutes);

export default router;
