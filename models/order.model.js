import mongoose from "mongoose";
import { decimal128ToJSON } from "../utils/decimal.helper.js";

const { Decimal128 } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema(
  {
    clientId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
    storeId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    paymentMethod: { type: String, required: true },
    totalAmount:   { type: Decimal128, default: null },
    detailsId:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'SaleDetail' }],
    date:          { type: Date,   default: Date.now },
    status:        { type: Number, default: 0 },
    paymentId:     { type: String, default: null },
    logisticsId:   { type: String, default: null },
  },
  decimal128ToJSON
);

const autoPopulate = function() {
  this.populate({ path: 'clientId', select: 'firstName lastName' })
      .populate({ path: 'storeId', select: 'name' })
      .populate({ path: 'detailsId', populate: { path: 'productoId', select: 'name' } });
};

orderSchema.pre('find', autoPopulate);
orderSchema.pre('findOne', autoPopulate);

export default mongoose.model('Order', orderSchema);
