import { Router } from "express";
import saleDetailController from "../controllers/saleDetail.controller.js";

const router = Router();

router.get('/', saleDetailController.getDetails);
router.get('/sale/:saleId', saleDetailController.getDetailsBySale);
router.post('/', saleDetailController.createDetail);
router.delete('/:id', saleDetailController.deleteDetail);

export default router;
