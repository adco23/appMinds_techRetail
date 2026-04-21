const service = require('../services/commerce.service.js');
const { validate } = require('../utils/validations.js');

const getCommerce = (req, res, next) => {
  try {
    let { cuit } = req.params;
    if (cuit) {
      const commerce = service.findByCuit(cuit);

      if (!commerce) return res.status(404).json({ error: 'Comercio no encontrado.' });

      return res.json(commerce);
    }
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

const deleteCommerce = (req, res, next) => {
  try {
    let { cuit } = req.params;

    if (!cuit) return res.status(400).json({ error: 'El CUIT es obligatorio.' });

    const commerce = service.findByCuit(cuit);

    if (!commerce) return res.status(404).json({ error: 'Comercio no encontrado.' });

    const statusDeleted = service.deleteCommerce(cuit);

    if (!statusDeleted) return res.status(500).json({ error: 'Error al eliminar el comercio.' });

    return res.json({ message: 'Comercio eliminado exitosamente.' });
  } catch (error) {
    next(error);
  }
}

const updateCommerce = (req, res, next) => {
  try {
    let { cuit } = req.params;
    const { name, email, phone, address } = req.body;

    if (!cuit) return res.status(400).json({ error: 'El CUIT es obligatorio.' });

    const commerce = service.findByCuit(cuit);

    if (!commerce) return res.status(404).json({ error: 'Comercio no encontrado.' });

    const validations = [
      { condition: !name, message: 'La razon social es obligatoria.' },
      { condition: !email, message: 'El correo es obligatorio.' }
    ];

    if (!validate(validations, res)) return;

    const statusUpdated = service.updateCommerce(cuit, { name, email, phone, address });

    if (!statusUpdated) return res.status(500).json({ error: 'Error al actualizar el comercio.' });
    return res.json({ message: 'Comercio actualizado exitosamente.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getCommerce, createCommerce, deleteCommerce, updateCommerce };
