const service = require('../services/sale.service.js');
const { validate } = require('../utils/validations.js');

const getSales = (req, res, next) => {
  try {
    let { id } = req.query;
    if (id) {
      const sale = service.findById(id);

      if (!sale) return res.status(404).json({ error: 'Venta no encontrada.' });

      return res.json(sale);
    }
    const sales = service.getSales();
    res.json(sales);
  } catch (error) {
    next(error);
  }
};

const createSale = (req, res, next) => {
  try {
    const { clientId, storeId, paymentMethod, detailsId } = req.body;

    const validations = [
      { condition: !clientId, message: 'El ID del cliente es obligatorio.' },
      { condition: !storeId, message: 'El ID de la tienda es obligatorio.' },
      { condition: !paymentMethod, message: 'El método de pago es obligatorio.' },
      { condition: !detailsId, message: 'El ID de los detalles de la venta es obligatorio.' }
    ];

    if (!validate(validations, res)) return;

    const statusCreated = service.createSale({ clientId, storeId, paymentMethod, detailsId });

    if (!statusCreated) return res.status(500).json({ error: 'Error al registrar la venta.' });
    res.status(201).json({ message: 'Venta (pendiente) registrada exitosamente.' });
  } catch (error) {
    next(error);
  }
}

const cancelSale = (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: 'El ID de la venta es obligatorio.' });

    const sale = service.findById(id);

    if (!sale) return res.status(404).json({ error: 'Venta no encontrada.' });

    if (sale.status === 0) return res.status(400).json({ error: 'La venta ya está cancelada.' });

    const statusCancelled = service.cancelSale(id);
  } catch (error) {
    next(error);
  }
}

module.exports = { getSales, createSale, cancelSale };
