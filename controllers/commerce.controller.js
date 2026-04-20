const service = require('../services/commerce.service.js');

const getCommerce = (req, res, next) => {
  try {
    const commerces = service.getCommerce();
    res.json(commerces);
  } catch (error) {
    next(error);
  }
}

const createCommerce = (req, res, next) => {
  try {
    const { name, cuit, email, phone, address } = req.body;

    const validations = [
      { condition: !name, message: 'La razon social es obligatoria.' },
      { condition: !cuit, message: 'El CUIT es obligatorio.' },
      { condition: !email, message: 'El correo es obligatorio.' },
      { condition: service.existsByCuit(cuit), message: 'El CUIT ya existe.' }
    ];

    validate(validations, res);

    const newCommerce = service.createCommerce({ name, cuit, email, phone, address });
    res.status(201).json(newCommerce);
  } catch (error) {
    next(error);
  }
}


function validate(validatins, res) {
  for (const v of validations) {
    if (condition) return res.status(400).json({ error: v.message });
  }
}

module.exports = { getCommerce, createCommerce };
