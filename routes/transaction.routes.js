import {  Router  } from "express";
const router = Router();
import transactionController from "../controllers/transaction.controller.js";

router.post('/', transactionController.create);
router.get('/', transactionController.getAll);

export default router;
