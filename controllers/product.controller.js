import productService from "../services/product.service.js";
import Store from "../models/store.model.js";

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
    const user = req.session?.user;
    const isCommerceAdmin = req.simulation?.isCommerceAdmin;

    const products = isCommerceAdmin
      ? await productService.getProductsByCommerceId(user.commerceId)
      : await productService.getAllProducts();

    res.render('products/index', { title: 'Productos', products, sim: req.simulation });
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
    const user = req.session?.user;
    const stores = req.simulation?.isCommerceAdmin
      ? await Store.find({ commerceId: user.commerceId })
      : await Store.find();
    const storeId = product.storeId && product.storeId._id ? product.storeId._id : product.storeId;

    res.render('products/edit', {
      title: 'Editar producto',
      product,
      stores,
      storeId,
      sim: req.simulation,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductNewView = async (req, res, next) => {
  try {
    const storeId = req.params.storeId || '';
    const user = req.session?.user;
    const stores = req.simulation?.isCommerceAdmin
      ? await Store.find({ commerceId: user.commerceId })
      : await Store.find();

    res.render('products/new', { title: 'Nuevo producto', storeId, stores, sim: req.simulation });
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
    res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
  } catch (error) {
    next(error);
  }
};

export const createProductFromView = async (req, res, next) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    const storeId = newProduct.storeId._id || newProduct.storeId;
    res.redirect(`/stores/view/${storeId}${getSimQuery(req)}`);
  } catch (error) {
    next(error);
  }
};
export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    res.json({ message: 'Producto actualizado exitosamente', product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

export const updateProductFromView = async (req, res, next) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    const storeId = updatedProduct.storeId._id || updatedProduct.storeId;
    res.redirect(`/stores/view/${storeId}${getSimQuery(req)}`);
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

    const storeId = product.storeId && product.storeId._id ? product.storeId._id : product.storeId;

    res.redirect(`/stores/view/${storeId}${getSimQuery(req)}`);
  } catch (error) {
    next(error);
  }
};
