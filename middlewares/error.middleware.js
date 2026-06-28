export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const message = err.message || 'Internal server error';

  const notFoundMessages = [
    'Store not found',
    'Product not found',
    'Order not found',
    'Commerce not found',
    'Plan no encontrado',
    'Suscripción no encontrada',
  ];

  if (notFoundMessages.includes(message)) {
    return res.status(404).json({
      message,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid identifier or parameter format',
    });
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error) => error.message);

    return res.status(400).json({
      message: 'Validation error',
      errors,
    });
  }

  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    const duplicatedFields = fields.length ? fields.join(', ') : 'field';

    return res.status(409).json({
      message: `Duplicate value for ${duplicatedFields}`,
    });
  }

  return res.status(err.statusCode || err.status || 500).json({
    message: err.statusCode || err.status ? message : 'Internal server error',
  });
};
