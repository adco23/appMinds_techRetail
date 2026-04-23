const service = require('../services/order.service.js');
const { validate } = require('../utils/validations.js');

const getOrders = (req, res, next) => {
  try {
    let { id } = req.query;
    if (id) {
      const order = service.findById(id);

      if (!order) return res.status(404).json({ error: 'Orden no encontrada.' });

      return res.json(order);
    }

    res.json(service.getSales());
  } catch (error) {
    next(error);
  }
};

const createOrder = (req, res, next) => {
  try {
    const { clientId, storeId, paymentMethod, detailsId } = req.body;

    const validations = [
      { condition: !clientId, message: 'El ID del cliente es obligatorio.' },
      { condition: !storeId, message: 'El ID de la tienda es obligatorio.' },
      { condition: !paymentMethod, message: 'El método de pago es obligatorio.' },
      { condition: !detailsId, message: 'El ID de los detalles de la Orden es obligatorio.' },
    ];

    if (!validate(validations, res)) return;

    const statusCreated = service.createSale({ clientId, storeId, paymentMethod, detailsId });

    if (!statusCreated) return res.status(500).json({ error: 'Error al registrar la Orden.' });
    res.status(201).json({ message: 'Orden (pendiente) registrada exitosamente.' });
  } catch (error) {
    next(error);
  }
};

const updateOrder = (req, res, next) => {
  try {
    let { id } = req.params;
    let { status } = req.query;

    if (!id) return res.status(400).json({ error: 'El ID de la Orden es obligatorio.' });
    id = parseInt(id);

    if (isNaN(status)) return res.status(400).json({ error: 'El estado de la orden debe ser numérico.' });
    status = parseInt(status);

    const order = service.findById(id);

    if (!order) return res.status(404).json({ error: 'Orden no encontrada.' });
    if (order.status != 0) return res.status(400).json({ error: 'La orden no puede ser modificada.' });

    const result = service.updateOrder(id, status);
    if (!result) return res.status(500).json({ error: 'Error al modificar la Orden.' });
    res.json({ message: 'Orden actualizada exitosamente.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOrders, createOrder, updateOrder };
