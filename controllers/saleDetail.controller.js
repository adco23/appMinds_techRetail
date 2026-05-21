const saleDetailService = require('../services/saleDetail.service');

const getDetails = async (req, res) => {
  try {
    const details = await saleDetailService.getDetails();
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los detalles de venta' });
  }
};

const getDetailsBySale = async (req, res) => {
  try {
    const { saleId } = req.params;
    const details = await saleDetailService.getDetailsBySaleId(saleId);
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener detalles por ID de venta' });
  }
};

const createDetail = async (req, res) => {
  try {
    const { cantidad, precioUnitario, ventaId, productoId } = req.body;

    if (!cantidad || !precioUnitario || !ventaId || !productoId) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para el detalle' });
    }

    const newDetail = await saleDetailService.createDetail(req.body);
    res.status(201).json(newDetail);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el detalle de venta' });
  }
};

const deleteDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await saleDetailService.deleteDetail(id);
    if (deleted) return res.status(200).json({ message: 'Detalle eliminado correctamente' });
    res.status(404).json({ error: 'Detalle no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el detalle' });
  }
};

module.exports = { getDetails, getDetailsBySale, createDetail, deleteDetail };
