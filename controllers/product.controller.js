const productService = require('../services/product.service');

const getSimQuery = req => {
  const role = req.query.role || '';
  const subscribed = req.query.subscribed === '1';
  if (!role) return '';
  return `?role=${role}${subscribed ? '&subscribed=1' : ''}`;
};

const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductsView = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.render('products/index', { title: 'Productos', products });
  } catch (error) {
    next(error);
  }
};

const getProductDetailView = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.render('products/show', { title: 'Detalle de producto', product });
  } catch (error) {
    next(error);
  }
};

const getProductEditView = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.render('products/edit', { title: 'Editar producto', product });
  } catch (error) {
    next(error);
  }
};

const getProductNewView = async (req, res, next) => {
  try {
    const storeId = req.params.storeId || '';
    res.render('products/new', { title: 'Nuevo producto', storeId });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    next(error);
  }
};

const createProductFromView = async (req, res, next) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.redirect(`/stores/view/${newProduct.storeId}${getSimQuery(req)}`);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

const updateProductFromView = async (req, res, next) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    res.redirect(`/stores/view/${updatedProduct.storeId}${getSimQuery(req)}`);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteProductFromView = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    await productService.deleteProduct(req.params.id);
    res.redirect(`/stores/view/${product.storeId}${getSimQuery(req)}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductsView,
  getProductDetailView,
  getProductEditView,
  getProductNewView,
  getProductById,
  createProduct,
  createProductFromView,
  updateProduct,
  updateProductFromView,
  deleteProduct,
  deleteProductFromView,
};
