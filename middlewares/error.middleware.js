const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.message === 'Store not found') {
    return res.status(404).json({
      message: err.message,
    });
  }

  if (err.message === 'Product not found') {
    return res.status(404).json({
      message: err.message,
    });
  }

  return res.status(400).json({
    message: err.message || 'Internal server error',
  });
};

module.exports = { errorHandler };
