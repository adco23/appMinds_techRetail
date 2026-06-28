import Product from "../models/product.model.js";
import Store from "../models/store.model.js";
import mongoose from "mongoose";

const getAllProducts = async () => {
  const products = await Product.find().populate('storeId');
  return products.map(p => p.toJSON());
};

const getProductsByCommerceId = async commerceId => {
  const stores = await Store.find({ commerceId }).select('_id');
  const storeIds = stores.map(s => s._id);
  const products = await Product.find({ storeId: { $in: storeIds } }).populate('storeId');
  return products.map(p => p.toJSON());
};

const getProductById = async id => {
  const product = await Product.findById(id).populate('storeId');
  if (!product) throw new Error('Product not found');
  return product.toJSON();
};

const getProductsByStoreId = async storeId => {
  const idToSearch = mongoose.isValidObjectId(storeId)
    ? new mongoose.Types.ObjectId(storeId)
    : storeId;

  const products = await Product.find({
    storeId: { $in: [storeId, idToSearch] }
  }).populate('storeId');
  return products.map(p => p.toJSON());
};

const createProduct = async data => {
  const { name, description, price, stock, category, storeId, status } = data;

  if (!name)                                      throw new Error('Se requiere el nombre del producto');
  if (!description)                               throw new Error('Se requiere la descripción del producto');
  if (price === undefined || price === null || price === '') throw new Error('Se requiere el precio del producto');
  if (stock === undefined || stock === null || stock === '') throw new Error('Se requiere el stock del producto');
  if (!category)                                  throw new Error('Se requiere la categoría del producto');
  if (!storeId)                                   throw new Error('Se requiere el id de la tienda');
  if (!status)                                    throw new Error('Se requiere el estado del producto');
  if (Number(price) < 0)                          throw new Error('El precio no puede ser negativo');
  if (Number(stock) < 0)                          throw new Error('El stock no puede ser negativo');

  const storeExists = await Store.findById(storeId);
  if (!storeExists) throw new Error('Tienda no encontrada');

  const newProduct = new Product({
    name,
    description,
    price:  Number(price),
    stock:  Number(stock),
    category,
    storeId,
    status,
  });

  return await newProduct.save();
};

const updateProduct = async (id, data) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Producto no encontrado');

  if (data.storeId) {
    const storeExists = await Store.findById(data.storeId);
    if (!storeExists) throw new Error('Tienda no encontrada');
  }

  if (data.price !== undefined && Number(data.price) < 0) throw new Error('El precio no puede ser negativo');
  if (data.stock !== undefined && Number(data.stock) < 0) throw new Error('El stock no puede ser negativo');

  const updated = await Product.findByIdAndUpdate(
    id,
    {
      name:        data.name        ?? product.name,
      description: data.description ?? product.description,
      price:       data.price  !== undefined ? Number(data.price)  : product.price,
      stock:       data.stock  !== undefined ? Number(data.stock)  : product.stock,
      category:    data.category    ?? product.category,
      storeId:     data.storeId     ?? product.storeId,
      status:      data.status      ?? product.status,
    },
    { new: true }
  );

  return updated;
};

const deleteProduct = async id => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error('Producto no encontrado');
  return { message: 'Producto eliminado exitosamente' };
};

// Equivalente a product.decreaseStock()
const decreaseStock = async (id, quantity) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Producto no encontrado');
  if (quantity > product.stock) throw new Error('Stock insuficiente');

  product.stock -= quantity;
  return await product.save();
};

// Equivalente a product.activate() / deactivate()
const activateProduct = async id => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Producto no encontrado');
  product.status = 'active';
  return await product.save();
};

const deactivateProduct = async id => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Producto no encontrado');
  product.status = 'inactive';
  return await product.save();
};

export default {
  getAllProducts,
  getProductsByCommerceId,
  getProductById,
  getProductsByStoreId,
  createProduct,
  updateProduct,
  deleteProduct,
  decreaseStock,
  activateProduct,
  deactivateProduct,
};
