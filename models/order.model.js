import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  clientId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
  storeId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  paymentMethod: { type: String, required: true },
  totalAmount:   { type: Number, default: null },
  detailsId:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'SaleDetail' }],
  date:          { type: Date,   default: Date.now },
  status:        { type: Number, default: 0 }, // 0 = pending, 1 = completed, 2 = cancelled
  paymentId:     { type: String, default: null },
  logisticsId:   { type: String, default: null },
});

export default mongoose.model('Order', orderSchema);
