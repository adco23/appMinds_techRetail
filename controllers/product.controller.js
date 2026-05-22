import productService from "../services/product.service.js";

export const getSimQuery = req => {
  const role = req.query.role || '';
  const subscribed = req.query.subscribed === '1';
  if (!role) return '';
  return `?role=${role}${subscribed ? '&subscribed=1' : ''}`;
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductsView = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.render('products/index', { title: 'Productos', products });
  } catch (error) {
    next(error);
  }
};

export const getProductDetailView = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.render('products/show', { title: 'Detalle de producto', product });
  } catch (error) {
    next(error);
  }
};

export const getProductEditView = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.render('products/edit', { title: 'Editar producto', product });
  } catch (error) {
    next(error);
  }
};

export const getProductNewView = async (req, res, next) => {
  try {
    const storeId = req.params.storeId || '';
    res.render('products/new', { title: 'Nuevo producto', storeId });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    next(error);
  }
};

export const createProductFromView = async (req, res, next) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.redirect(`/stores/view/${newProduct.storeId}${getSimQuery(req)}`);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

export const updateProductFromView = async (req, res, next) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    res.redirect(`/stores/view/${updatedProduct.storeId}${getSimQuery(req)}`);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteProductFromView = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    await productService.deleteProduct(req.params.id);
    res.redirect(`/stores/view/${product.storeId}${getSimQuery(req)}`);
  } catch (error) {
    next(error);
  }
};
