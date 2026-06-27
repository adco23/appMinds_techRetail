import * as storeService from "../services/store.service.js";
import productService from "../services/product.service.js";
import * as commerceService from '../services/commerce.service.js';
import { getSimulationData } from '../middlewares/simulation.middleware.js';

export const getSimQuery = req => {
  const role = req.query.role || '';
  const subscribed = req.query.subscribed === '1';
  if (!role) return '';
  return `?role=${role}${subscribed ? '&subscribed=1' : ''}`;
};

export const getStores = async (req, res, next) => {
  try {
    const stores = await storeService.getAllStores();
    res.json(stores);
  } catch (error) {
    next(error);
  }
};

export const getStoresView = async (req, res, next) => {
  try {
    const sim = getSimulationData(req);
    const user = req.session?.user;

    let stores;
    if (sim.isCommerceAdmin) {
      if (!user?.commerceId) {
        return res.redirect('/commerce-admin/create');
      }
      stores = await storeService.getStoresByCommerceId(user.commerceId);
    } else {
      stores = await storeService.getAllStores();
    }

    res.render('stores/index', { title: 'Tiendas', stores, sim });
  } catch (error) {
    next(error);
  }
};

export const getStoreNewView = async (req, res, next) => {
  try {
    const sim = res.locals.sim;
    const user = req.session?.user;

    if (sim.isCommerceAdmin && !user?.commerceId) {
      return res.redirect('/commerce-admin/create');
    }

    let commerces = [];
    if (sim.isPlatformAdmin) {
      commerces = await commerceService.getCommerce();
    }

    res.render('stores/new', { title: 'Nueva tienda', commerces, sim, user });
  } catch (error) {
    next(error);
  }
};

export const getStoreDetailView = async (req, res, next) => {
  try {
    const store    = await storeService.getStoreById(req.params.id);
    const products = await productService.getProductsByStoreId(req.params.id);
    res.render('stores/show', { title: 'Detalle de tienda', store, products });
  } catch (error) {
    next(error);
  }
};

export const getStoreEditView = async (req, res, next) => {
  try {
    const store = await storeService.getStoreById(req.params.id);
    res.render('stores/edit', { title: 'Editar tienda', store });
  } catch (error) {
    next(error);
  }
};

export const getStoreById = async (req, res, next) => {
  try {
    const store = await storeService.getStoreById(req.params.id);
    res.json(store);
  } catch (error) {
    next(error);
  }
};

export const createStore = async (req, res, next) => {
  try {
    const newStore = await storeService.createStore(req.body);
    res.status(201).json({ message: 'Store created successfully', store: newStore });
  } catch (error) {
    next(error);
  }
};

export const createStoreFromView = async (req, res, next) => {
  try {
    const sim = res.locals.sim;
    const user = req.session?.user;

    const storeData = { ...req.body };
    if (sim.isCommerceAdmin && user?.commerceId) {
      storeData.commerceId = user.commerceId;
    }

    await storeService.createStore(storeData);
    res.redirect(`/stores/view${getSimQuery(req)}`);
  } catch (error) {
    next(error);
  }
};

export const updateStore = async (req, res, next) => {
  try {
    const updatedStore = await storeService.updateStore(req.params.id, req.body);
    res.json({ message: 'Store updated successfully', store: updatedStore });
  } catch (error) {
    next(error);
  }
};

export const updateStoreFromView = async (req, res, next) => {
  try {
    await storeService.updateStore(req.params.id, req.body);
    res.redirect(`/stores/view${getSimQuery(req)}`);
  } catch (error) {
    next(error);
  }
};

export const deleteStore = async (req, res, next) => {
  try {
    const result = await storeService.deleteStore(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteStoreFromView = async (req, res, next) => {
  try {
    await storeService.deleteStore(req.params.id);
    res.redirect(`/stores/view${getSimQuery(req)}`);
  } catch (error) {
    next(error);
  }
};
