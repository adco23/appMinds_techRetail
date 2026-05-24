import express from "express";
const router = express.Router();

import {
  getStores,
  getStoresView,
  getStoreDetailView,
  getStoreEditView,
  getStoreNewView,
  getStoreById,
  createStore,
  createStoreFromView,
  updateStore,
  updateStoreFromView,
  deleteStore,
  deleteStoreFromView,
 } from "../controllers/store.controller.js";

router.get('/', getStores);
router.get('/view', getStoresView);
router.get('/view/new', getStoreNewView);
router.get('/view/:id', getStoreDetailView);
router.get('/edit/:id', getStoreEditView);

router.get('/:id', getStoreById);

router.post('/', createStore);
router.post('/view', createStoreFromView);
router.post('/edit/:id', updateStoreFromView);
router.post('/delete/:id', deleteStoreFromView);

router.put('/:id', updateStore);
router.delete('/:id', deleteStore);

export default router;
