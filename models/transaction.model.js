import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  receiptId:     { type: String, required: true },
  grossAmount:   { type: Number, required: true },
  feeAmount:     { type: Number },
  netAmount:     { type: Number },
  date:          { type: Date,   default: Date.now },
  status:        { type: String, required: true },
  paymentMethod: { type: String, required: true },
  gatewayRef:    { type: String, required: true },
  saleId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
});

// Calcula fee y net antes de guardar
transactionSchema.pre('save', function (next) {
  this.feeAmount = this.grossAmount * 0.02;
  this.netAmount = this.grossAmount - this.feeAmount;
  next();
});

export default mongoose.model('Transaction', transactionSchema);
