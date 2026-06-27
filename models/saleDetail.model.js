import mongoose from "mongoose";

const saleDetailSchema = new mongoose.Schema({
  cantidad:       { type: Number, required: true },
  precioUnitario: { type: Number, required: true },
  subtotal:       { type: Number },
  ventaId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Order',   required: true },
  productoId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
});

saleDetailSchema.pre('save', function () {
  this.subtotal = this.cantidad * this.precioUnitario;
});

export default mongoose.model('SaleDetail', saleDetailSchema);
