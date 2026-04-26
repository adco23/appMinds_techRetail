const fileHandler = require('../utils/fileHandler');
const Product = require('../models/product.model');

const PRODUCT_FILE = 'products.json';
const STORE_FILE = 'stores.json';

const getAllProducts = () => {
  return fileHandler.readFile(PRODUCT_FILE);
};

const getProductById = id => {
  const products = fileHandler.readFile(PRODUCT_FILE);
  const product = products.find(product => product.id === parseInt(id));

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

const getProductsByStoreId = storeId => {
  const products = fileHandler.readFile(PRODUCT_FILE);
  return products.filter(product => product.storeId === parseInt(storeId));
};

const createProduct = data => {
  const products = fileHandler.readFile(PRODUCT_FILE);
  const stores = fileHandler.readFile(STORE_FILE);

  if (!data.id) {
    throw new Error('Product id is required');
  }

  if (!data.name) {
    throw new Error('Product name is required');
  }

  if (!data.description) {
    throw new Error('Product description is required');
  }

  if (data.price === undefined || data.price === null || data.price === '') {
    throw new Error('Product price is required');
  }

  if (data.stock === undefined || data.stock === null || data.stock === '') {
    throw new Error('Product stock is required');
  }

  if (!data.category) {
    throw new Error('Product category is required');
  }

  if (!data.storeId) {
    throw new Error('Store id is required');
  }

  if (!data.status) {
    throw new Error('Product status is required');
  }

  const existingId = products.find(product => product.id === parseInt(data.id));

  if (existingId) {
    throw new Error('A product with this id already exists');
  }

  const storeExists = stores.find(store => store.id === parseInt(data.storeId));

  if (!storeExists) {
    throw new Error('Store not found');
  }

  if (Number(data.price) < 0) {
    throw new Error('Price cannot be negative');
  }

  if (Number(data.stock) < 0) {
    throw new Error('Stock cannot be negative');
  }

  const newProduct = new Product(
    parseInt(data.id),
    data.name,
    data.description,
    Number(data.price),
    Number(data.stock),
    data.category,
    parseInt(data.storeId),
    data.status,
  );

  products.push(newProduct);
  fileHandler.writeFile(PRODUCT_FILE, products);

  return newProduct;
};

const updateProduct = (id, data) => {
  const products = fileHandler.readFile(PRODUCT_FILE);
  const stores = fileHandler.readFile(STORE_FILE);

  const product = products.find(product => product.id === parseInt(id));

  if (!product) {
    throw new Error('Product not found');
  }

  if (data.storeId) {
    const storeExists = stores.find(store => store.id === parseInt(data.storeId));

    if (!storeExists) {
      throw new Error('Store not found');
    }
  }

  if (data.price !== undefined && Number(data.price) < 0) {
    throw new Error('Price cannot be negative');
  }

  if (data.stock !== undefined && Number(data.stock) < 0) {
    throw new Error('Stock cannot be negative');
  }

  product.name = data.name ?? product.name;
  product.description = data.description ?? product.description;
  product.price = data.price !== undefined ? Number(data.price) : product.price;
  product.stock = data.stock !== undefined ? Number(data.stock) : product.stock;
  product.category = data.category ?? product.category;
  product.storeId = data.storeId ? parseInt(data.storeId) : product.storeId;
  product.status = data.status ?? product.status;

  fileHandler.writeFile(PRODUCT_FILE, products);

  return product;
};

const deleteProduct = id => {
  const products = fileHandler.readFile(PRODUCT_FILE);
  const filteredProducts = products.filter(product => product.id !== parseInt(id));

  if (products.length === filteredProducts.length) {
    throw new Error('Product not found');
  }

  fileHandler.writeFile(PRODUCT_FILE, filteredProducts);

  return { message: 'Product deleted successfully' };
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByStoreId,
  createProduct,
  updateProduct,
  deleteProduct,
};
