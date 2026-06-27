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

transactionSchema.pre('save', async function () {
  const Order        = mongoose.model('Order');
  const Subscription = mongoose.model('Subscription');
  const Plan         = mongoose.model('Plan');

  let commissionRate = 0.02;

  const order = await Order.findById(this.saleId);
  if (order && order.storeId) {
    const sub = await Subscription.findOne({ storeId: order.storeId, status: 'Activa' });
    if (sub) {
      const plan = await Plan.findOne({ name: sub.detail });
      if (plan && plan.commission) {
        commissionRate = fromD128(plan.commission).div(100).toNumber();
      }
    }
  }

  const gross    = fromD128(this.grossAmount);
  const fee      = gross.mul(commissionRate.toString());
  this.feeAmount = toD128(fee);
  this.netAmount = toD128(gross.minus(fee));
});

export default mongoose.model('Transaction', transactionSchema);
