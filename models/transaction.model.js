import mongoose from "mongoose";
import { toD128, fromD128, decimal128ToJSON } from "../utils/decimal.helper.js";

const { Decimal128 } = mongoose.Schema.Types;

const transactionSchema = new mongoose.Schema(
  {
    receiptId:     { type: String,    required: true },
    grossAmount:   { type: Decimal128, required: true },
    feeAmount:     { type: Decimal128 },
    netAmount:     { type: Decimal128 },
    date:          { type: Date,      default: Date.now },
    status:        { type: String,    required: true },
    paymentMethod: { type: String,    required: true },
    gatewayRef:    { type: String,    required: true },
    saleId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  },
  decimal128ToJSON
);

transactionSchema.pre('save', function () {
  const gross = fromD128(this.grossAmount);
  const fee   = gross.mul('0.02');
  this.feeAmount = toD128(fee);
  this.netAmount = toD128(gross.minus(fee));
});

export default mongoose.model('Transaction', transactionSchema);
