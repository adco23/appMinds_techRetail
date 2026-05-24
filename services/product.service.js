import Product from "../models/product.model.js";
import Store from "../models/store.model.js";

const getAllProducts = async () => {
  return await Product.find().populate('storeId');
};

const getProductById = async id => {
  const product = await Product.findById(id).populate('storeId');
  if (!product) throw new Error('Product not found');
  return product;
};

const getProductsByStoreId = async storeId => {
  return await Product.find({ storeId }).populate('storeId');
};

const createProduct = async data => {
  const { name, description, price, stock, category, storeId, status } = data;

  if (!name)                                      throw new Error('Product name is required');
  if (!description)                               throw new Error('Product description is required');
  if (price === undefined || price === null || price === '') throw new Error('Product price is required');
  if (stock === undefined || stock === null || stock === '') throw new Error('Product stock is required');
  if (!category)                                  throw new Error('Product category is required');
  if (!storeId)                                   throw new Error('Store id is required');
  if (!status)                                    throw new Error('Product status is required');
  if (Number(price) < 0)                          throw new Error('Price cannot be negative');
  if (Number(stock) < 0)                          throw new Error('Stock cannot be negative');

  const storeExists = await Store.findById(storeId);
  if (!storeExists) throw new Error('Store not found');

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
  if (!product) throw new Error('Product not found');

  if (data.storeId) {
    const storeExists = await Store.findById(data.storeId);
    if (!storeExists) throw new Error('Store not found');
  }

  if (data.price !== undefined && Number(data.price) < 0) throw new Error('Price cannot be negative');
  if (data.stock !== undefined && Number(data.stock) < 0) throw new Error('Stock cannot be negative');

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
  if (!product) throw new Error('Product not found');
  return { message: 'Product deleted successfully' };
};

// Equivalente a product.decreaseStock()
const decreaseStock = async (id, quantity) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');
  if (quantity > product.stock) throw new Error('Insufficient stock');

  product.stock -= quantity;
  return await product.save();
};

// Equivalente a product.activate() / deactivate()
const activateProduct = async id => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');
  product.status = 'active';
  return await product.save();
};

const deactivateProduct = async id => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');
  product.status = 'inactive';
  return await product.save();
};

export default {
  getAllProducts,
  getProductById,
  getProductsByStoreId,
  createProduct,
  updateProduct,
  deleteProduct,
  decreaseStock,
  activateProduct,
  deactivateProduct,
};
