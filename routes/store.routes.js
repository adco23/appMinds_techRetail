const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/store.controller");

router.get("/", getStores);
router.get("/view", getStoresView);
router.get("/view/new", getStoreNewView);
router.get("/view/:id", getStoreDetailView);
router.get("/edit/:id", getStoreEditView);

router.get("/:id", getStoreById);

router.post("/", createStore);
router.post("/view", createStoreFromView);
router.post("/edit/:id", updateStoreFromView);
router.post("/delete/:id", deleteStoreFromView);

router.put("/:id", updateStore);
router.delete("/:id", deleteStore);

module.exports = router;