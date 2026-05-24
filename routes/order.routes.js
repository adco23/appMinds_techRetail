import {  Router  } from "express";
import {  getOrders, createOrder, updateOrder  } from "../controllers/order.controller.js";

const router = Router();

router.get('/', getOrders);
router.post('/', createOrder);
// router.put('/:cuit', updateCommerce);
router.put('/:id', updateOrder);

export default router;
