import SaleDetail from "../models/saleDetail.model.js";

const getDetails = async () => {
  return await SaleDetail.find();
};

const getDetailsBySaleId = async saleId => {
  return await SaleDetail.find({ ventaId: saleId });
};

const createDetail = async data => {
  const newDetail = new SaleDetail({
    cantidad:       data.cantidad,
    precioUnitario: data.precioUnitario,
    ventaId:        data.ventaId,
    productoId:     data.productoId,
  });

  return await newDetail.save(); // pre('save') calcula subtotal automáticamente
};

const deleteDetail = async id => {
  const detail = await SaleDetail.findByIdAndDelete(id);
  if (!detail) return false;
  return true;
};

export default {
  getDetails,
  getDetailsBySaleId,
  createDetail,
  deleteDetail,
};
