import mongoose from "mongoose";
import Decimal from "decimal.js";
import { toD128, fromD128, decimal128ToJSON } from "../utils/decimal.helper.js";

const { Decimal128 } = mongoose.Schema.Types;

const saleDetailSchema = new mongoose.Schema(
  {
    cantidad:       { type: Number,    required: true },
    precioUnitario: { type: Decimal128, required: true },
    subtotal:       { type: Decimal128 },
    ventaId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Order',   required: true },
    productoId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  decimal128ToJSON
);

saleDetailSchema.pre('save', async function() {
  const precio = fromD128(this.precioUnitario);
  const qty    = new Decimal(this.cantidad);
  this.subtotal = toD128(precio.mul(qty));

});

export default mongoose.model('SaleDetail', saleDetailSchema);
