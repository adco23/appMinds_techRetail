import Store from '../models/store.model.js';

const getAllStores = async () => {
  return await Store.find().populate('commerceId');
};

const getStoresByCommerceId = async commerceId => {
  return await Store.find({ commerceId }).populate('commerceId');
};

const getStoreById = async id => {
  const store = await Store.findById(id).populate('commerceId');
  if (!store) throw new Error('Store not found');
  return store;
};

const createStore = async data => {
  const { name, category, subdomain, status, commerceId, createdAt } = data;

  if (!name)       throw new Error('Store name is required');
  if (!category)   throw new Error('Store category is required');
  if (!subdomain)  throw new Error('Store subdomain is required');
  if (!status)     throw new Error('Store status is required');
  if (!commerceId) throw new Error('Commerce id is required');
  if (!createdAt)  throw new Error('Created date is required');

  const existing = await Store.findOne({ subdomain: { $regex: new RegExp(`^${subdomain}$`, 'i') } });
  if (existing) throw new Error('Subdomain already exists');

  return await new Store({ name, category, subdomain, status, commerceId, createdAt }).save();
};

export const updateStore = async (id, data) => {
  const allowedUpdates = {
    name: data.name,
    category: data.category,
    subdomain: data.subdomain,
    status: data.status,
    commerceId: data.commerceId
  };

  const updatedStore = await Store.findByIdAndUpdate(id, allowedUpdates, {
    new: true,
    runValidators: true
  }).populate('commerceId');

  if (!updatedStore) {
    throw new Error('Store not found');
  }

  return updatedStore;
};

const deleteStore = async id => {
  const store = await Store.findByIdAndDelete(id);
  if (!store) throw new Error('Store not found');
  return { message: 'Store deleted successfully' };
};

export { getAllStores, getStoresByCommerceId, getStoreById, createStore, deleteStore };