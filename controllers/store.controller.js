const storeService = require("../services/store.service");
const productService = require("../services/product.service");

const getSimQuery = req => {
  const role = req.query.role || "";
  const subscribed = req.query.subscribed === "1";

  if (!role) return "";

  return `?role=${role}${subscribed ? "&subscribed=1" : ""}`;
};

const getStores = (req, res, next) => {
  try {
    const stores = storeService.getAllStores();
    res.json(stores);
  } catch (error) {
    next(error);
  }
};

const getStoresView = (req, res, next) => {
  try {
    const stores = storeService.getAllStores();
    res.render("stores/index", {
      title: "Tiendas",
      stores,
    });
  } catch (error) {
    next(error);
  }
};

const getStoreNewView = (req, res, next) => {
  try {
    res.render("stores/new", {
      title: "Nueva tienda",
    });
  } catch (error) {
    next(error);
  }
};

const getStoreDetailView = (req, res, next) => {
  try {
    const store = storeService.getStoreById(req.params.id);
    const products = productService.getProductsByStoreId(req.params.id);

    res.render("stores/show", {
      title: "Detalle de tienda",
      store,
      products,
    });
  } catch (error) {
    next(error);
  }
};

const getStoreEditView = (req, res, next) => {
  try {
    const store = storeService.getStoreById(req.params.id);
    res.render("stores/edit", {
      title: "Editar tienda",
      store,
    });
  } catch (error) {
    next(error);
  }
};

const getStoreById = (req, res, next) => {
  try {
    const store = storeService.getStoreById(req.params.id);
    res.json(store);
  } catch (error) {
    next(error);
  }
};

const createStore = (req, res, next) => {
  try {
    const newStore = storeService.createStore(req.body);
    res.status(201).json({
      message: "Store created successfully",
      store: newStore,
    });
  } catch (error) {
    next(error);
  }
};

const createStoreFromView = (req, res, next) => {
  try {
    storeService.createStore(req.body);
    res.redirect(`/stores/view${getSimQuery(req)}`);
  } catch (error) {
    next(error);
  }
};

const updateStore = (req, res, next) => {
  try {
    const updatedStore = storeService.updateStore(req.params.id, req.body);
    res.json({
      message: "Store updated successfully",
      store: updatedStore,
    });
  } catch (error) {
    next(error);
  }
};

const updateStoreFromView = (req, res, next) => {
  try {
    storeService.updateStore(req.params.id, req.body);
    res.redirect(`/stores/view${getSimQuery(req)}`);
  } catch (error) {
    next(error);
  }
};

const deleteStore = (req, res, next) => {
  try {
    const result = storeService.deleteStore(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteStoreFromView = (req, res, next) => {
  try {
    storeService.deleteStore(req.params.id);
    res.redirect(`/stores/view${getSimQuery(req)}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStores,
  getStoresView,
  getStoreNewView,
  getStoreDetailView,
  getStoreEditView,
  getStoreById,
  createStore,
  createStoreFromView,
  updateStore,
  updateStoreFromView,
  deleteStore,
  deleteStoreFromView,
};
