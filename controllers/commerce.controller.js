const service = require('../services/commerce.service.js');

function validate(validations, res) {
  for (let v of validations) {
    if (v.condition) {
      res.status(400).json({ error: v.message });
      return false;
    }
  }
  return true;
}

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

    if (!validate(validations, res)) return;

    const statusCreated = service.createCommerce({ name, cuit, email, phone, address });

    if (!statusCreated) return res.status(500).json({ error: 'Error al crear el comercio.' });
    res.status(201).json({ message: 'Comercio creado exitosamente.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getCommerce, createCommerce };
