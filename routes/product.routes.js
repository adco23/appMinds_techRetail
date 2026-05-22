import express from 'express';
const router = express.Router();

import {
  getProducts,
  getProductsView,
  getProductDetailView,
  getProductEditView,
  getProductNewView,
  getProductById,
  createProduct,
  createProductFromView,
  updateProduct,
  updateProductFromView,
  deleteProduct,
  deleteProductFromView,
} from '../controllers/product.controller.js';

router.get('/', getProducts);
router.get('/view', getProductsView);
router.get('/view/new', getProductNewView);
router.get('/view/new/:storeId', getProductNewView);
router.get('/view/:id', getProductDetailView);
router.get('/edit/:id', getProductEditView);

router.get('/:id', getProductById);

router.post('/', createProduct);
router.post('/view', createProductFromView);
router.post('/edit/:id', updateProductFromView);
router.post('/delete/:id', deleteProductFromView);

router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
