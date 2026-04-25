const fileHandler = require('../utils/fileHandler');
const Store = require('../models/store.model');

const FILE_NAME = 'stores.json';

const getAllStores = () => {
  return fileHandler.readFile(FILE_NAME);
};

const getStoreById = id => {
  const stores = fileHandler.readFile(FILE_NAME);
  const store = stores.find(store => store.id === parseInt(id));

  if (!store) {
    throw new Error('Store not found');
  }

  return store;
};

const createStore = data => {
  const stores = fileHandler.readFile(FILE_NAME);

  if (!data.id) {
    throw new Error('Store id is required');
  }

  if (!data.name) {
    throw new Error('Store name is required');
  }

  if (!data.category) {
    throw new Error('Store category is required');
  }

  if (!data.subdomain) {
    throw new Error('Store subdomain is required');
  }

  if (!data.status) {
    throw new Error('Store status is required');
  }

  if (!data.commerceId) {
    throw new Error('Commerce id is required');
  }

  if (!data.createdAt) {
    throw new Error('Created date is required');
  }

  const existingId = stores.find(store => store.id === parseInt(data.id));
  if (existingId) {
    throw new Error('A store with this id already exists');
  }

  const existingSubdomain = stores.find(store => store.subdomain.toLowerCase() === data.subdomain.toLowerCase());

  if (existingSubdomain) {
    throw new Error('Subdomain already exists');
  }

  const newStore = new Store(
    parseInt(data.id),
    data.name,
    data.category,
    data.subdomain,
    data.status,
    parseInt(data.commerceId),
    data.createdAt,
  );

  stores.push(newStore);
  fileHandler.writeFile(FILE_NAME, stores);

  return newStore;
};

const updateStore = (id, data) => {
  const stores = fileHandler.readFile(FILE_NAME);
  const store = stores.find(store => store.id === parseInt(id));

  if (!store) {
    throw new Error('Store not found');
  }

  if (data.subdomain && data.subdomain !== store.subdomain) {
    const repeatedSubdomain = stores.find(
      item => item.subdomain.toLowerCase() === data.subdomain.toLowerCase() && item.id !== store.id,
    );

    if (repeatedSubdomain) {
      throw new Error('Subdomain already exists');
    }
  }

  store.name = data.name ?? store.name;
  store.category = data.category ?? store.category;
  store.subdomain = data.subdomain ?? store.subdomain;
  store.status = data.status ?? store.status;
  store.commerceId = data.commerceId ? parseInt(data.commerceId) : store.commerceId;
  store.createdAt = data.createdAt ?? store.createdAt;

  fileHandler.writeFile(FILE_NAME, stores);

  return store;
};

const deleteStore = id => {
  const stores = fileHandler.readFile(FILE_NAME);
  const filteredStores = stores.filter(store => store.id !== parseInt(id));

  if (stores.length === filteredStores.length) {
    throw new Error('Store not found');
  }

  fileHandler.writeFile(FILE_NAME, filteredStores);

  return { message: 'Store deleted successfully' };
};

module.exports = {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
};
