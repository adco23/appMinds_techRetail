import Store from '../models/store.model.js';

const getAllStores = async () => {
  return await Store.find().populate('commerceId');
};

const getStoresByCommerceId = async commerceId => {
  return await Store.find({ commerceId }).populate('commerceId');
};

const getStoreById = async id => {
  const store = await Store.findById(id).populate('commerceId');
  if (!store) throw new Error('Tienda no encontrada');
  return store;
};

const createStore = async data => {
  const { name, category, subdomain, status, commerceId, createdAt } = data;

  if (!name)       throw new Error('Se requiere el nombre de la tienda');
  if (!category)   throw new Error('Se requiere la categoría de la tienda');
  if (!subdomain)  throw new Error('Se requiere el subdominio de la tienda');
  if (!status)     throw new Error('Se requiere el estado de la tienda');
  if (!commerceId) throw new Error('Se requiere el id del comercio');
  if (!createdAt)  throw new Error('Se requiere la fecha de creación');

  const existing = await Store.findOne({ subdomain: { $regex: new RegExp(`^${subdomain}$`, 'i') } });
  if (existing) throw new Error('El subdominio ya existe');

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
    throw new Error('Tienda no encontrada');
  }

  return updatedStore;
};

const deleteStore = async id => {
  const store = await Store.findByIdAndDelete(id);
  if (!store) throw new Error('Tienda no encontrada');
  return { message: 'Tienda eliminada exitosamente' };
};

export { getAllStores, getStoresByCommerceId, getStoreById, createStore, deleteStore };
