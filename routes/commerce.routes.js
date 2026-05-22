import {  Router  } from "express";
import { 
  getCommerce,
  createCommerce,
  deleteCommerce,
  updateCommerce,
 } from "../controllers/commerce.controller.js";

const router = Router();

router.get('/', getCommerce);
router.get('/:cuit', getCommerce);
router.post('/', createCommerce);
router.put('/:cuit', updateCommerce);
router.delete('/:cuit', deleteCommerce);

export default router;
