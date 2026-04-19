const responseFormatter = (req, res, next) => {
  res.success = (data, message = 'Operación exitosa') => {
    return res.json({
      status: 'success',
      message,
      data,
    });
  };

  res.errorResponse = (message = 'Error interno del servidor', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
      status: 'error',
      message,
      errors,
    });
  };

  next();
};

module.exports = responseFormatter;
