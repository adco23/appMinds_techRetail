const productService = require("../services/product.service");

const getProducts = (req, res, next) => {
  try {
    const products = productService.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductsView = (req, res, next) => {
  try {
    const products = productService.getAllProducts();
    res.render("products/index", {
      title: "Productos",
      products,
    });
  } catch (error) {
    next(error);
  }
};

const getProductDetailView = (req, res, next) => {
  try {
    const product = productService.getProductById(req.params.id);
    res.render("products/show", {
      title: "Detalle de producto",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const getProductEditView = (req, res, next) => {
  try {
    const product = productService.getProductById(req.params.id);
    res.render("products/edit", {
      title: "Editar producto",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const getProductNewView = (req, res, next) => {
  try {
    const storeId = req.params.storeId || "";
    res.render("products/new", {
      title: "Nuevo producto",
      storeId,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = (req, res, next) => {
  try {
    const product = productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = (req, res, next) => {
  try {
    const newProduct = productService.createProduct(req.body);
    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

const createProductFromView = (req, res, next) => {
  try {
    const newProduct = productService.createProduct(req.body);
    res.redirect(`/stores/view/${newProduct.storeId}`);
  } catch (error) {
    next(error);
  }
};

const updateProduct = (req, res, next) => {
  try {
    const updatedProduct = productService.updateProduct(req.params.id, req.body);
    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

const updateProductFromView = (req, res, next) => {
  try {
    const updatedProduct = productService.updateProduct(req.params.id, req.body);
    res.redirect(`/stores/view/${updatedProduct.storeId}`);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = (req, res, next) => {
  try {
    const result = productService.deleteProduct(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteProductFromView = (req, res, next) => {
  try {
    const product = productService.getProductById(req.params.id);
    productService.deleteProduct(req.params.id);
    res.redirect(`/stores/view/${product.storeId}`);
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