import { Router } from 'express';
import {
  createProductFromView,
  deleteProductFromView,
  getProductDetailView,
  getProductEditView,
  getProductNewView,
  getProductsView,
  updateProductFromView,
} from '../controllers/product.controller.js';
import { commerceNeedsSubscription } from '../middlewares/simulation.middleware.js';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(ensureAuthenticated, commerceNeedsSubscription);

router.get('/view', getProductsView);
router.get('/view/new', getProductNewView);
router.get('/view/new/:storeId', getProductNewView);
router.get('/view/:id', getProductDetailView);
router.get('/edit/:id', getProductEditView);

router.post('/view', createProductFromView);
router.post('/edit/:id', updateProductFromView);
router.post('/delete/:id', deleteProductFromView);

export default router;
