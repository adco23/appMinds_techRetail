import mongoose from "mongoose";

const saleDetailSchema = new mongoose.Schema({
  cantidad:       { type: Number, required: true },
  precioUnitario: { type: Number, required: true },
  subtotal:       { type: Number },
  ventaId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Order',   required: true },
  productoId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
});

// Equivalente a calculateSubtotal() — se calcula antes de guardar
saleDetailSchema.pre('save', function (next) {
  this.subtotal = this.cantidad * this.precioUnitario;
  next();
});

export default mongoose.model('SaleDetail', saleDetailSchema);
