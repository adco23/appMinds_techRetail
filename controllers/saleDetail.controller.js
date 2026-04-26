const saleDetailService = require('../services/saleDetail.service');

const getDetails = (req, res) => {
  try {
    const details = saleDetailService.getDetails();
    res.status(200).json(details);
  } catch (error) {
    console.error('ERROR EN getDetails:', error);
    res.status(500).json({ error: 'Error al obtener los detalles de venta' });
  }
};

const getDetailsBySale = (req, res) => {
  try {
    const { saleId } = req.params;
    const details = saleDetailService.getDetailsBySaleId(saleId);
    res.status(200).json(details);
  } catch (error) {
    console.error('ERROR EN getDetailsBySale:', error);
    res.status(500).json({ error: 'Error al obtener detalles por ID de venta' });
  }
};

const createDetail = (req, res) => {
  try {
    const { cantidad, precioUnitario, ventaId, productoId } = req.body;

    // Validación de campos obligatorios
    if (!cantidad || !precioUnitario || !ventaId || !productoId) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para el detalle' });
    }

    const newDetail = saleDetailService.createDetail(req.body);
    res.status(201).json(newDetail);
  } catch (error) {
    console.error('ERROR EN createDetail:', error);
    res.status(500).json({ error: 'Error al registrar el detalle de venta' });
  }
};

const deleteDetail = (req, res) => {
  try {
    const { id } = req.params;
    if (saleDetailService.deleteDetail(id)) {
      return res.status(200).json({ message: 'Detalle eliminado correctamente' });
    }
    res.status(404).json({ error: 'Detalle no encontrado' });
  } catch (error) {
    console.error('ERROR EN deleteDetail:', error);
    res.status(500).json({ error: 'Error al eliminar el detalle' });
  }
};

module.exports = {
  getDetails,
  getDetailsBySale,
  createDetail,
  deleteDetail,
};
