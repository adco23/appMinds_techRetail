import Commerce from "../models/commerce.model.js";

export const getCommerce = async () => {
  return await Commerce.find();
};

export const findByCuit = async cuit => {
  return await Commerce.findOne({ cuit });
};

export const existsByCuit = async cuit => {
  const commerce = await findByCuit(cuit);
  return !!commerce;
};

export const createCommerce = async ({ name, cuit, email, phone, address }) => {
  const existing = await existsByCuit(cuit);
  if (existing) throw new Error('CUIT already exists');

  const newCommerce = new Commerce({ name, cuit, email, phone, address });
  return await newCommerce.save();
};

// Equivalente a commerce.deactivate() — deleteCommerce desactiva en vez de eliminar
export const deleteCommerce = async cuit => {
  const commerce = await findByCuit(cuit);
  if (!commerce) return false;

  commerce.status = 0;
  await commerce.save();
  return true;
};

export const updateCommerce = async (cuit, { name, email, phone, address }) => {
  const commerce = await findByCuit(cuit);
  if (!commerce) return false;

  commerce.name    = name    || commerce.name;
  commerce.email   = email   || commerce.email;
  commerce.phone   = phone   || commerce.phone;
  commerce.address = address || commerce.address;

  await commerce.save();
  return true;
};

// Equivalente a commerce.activate()
export const activateCommerce = async id => {
  const commerce = await Commerce.findById(id);
  if (!commerce) throw new Error('Commerce not found');

  commerce.status = 1;
  return await commerce.save();
};

export const deactivateCommerce = async id => {
  const commerce = await Commerce.findById(id);
  if (!commerce) throw new Error('Commerce not found');

  commerce.status = 0;
  return await commerce.save();
};
