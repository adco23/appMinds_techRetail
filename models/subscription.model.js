import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  detail:    { type: String, required: true },
  amount:    { type: Number, required: true },
  startDate: { type: String, required: true },
  expDate:   { type: String, required: true },
  status:    { type: String, default: 'active', enum: ['active', 'cancelled'] },
  storeId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
});

export default mongoose.model('Subscription', subscriptionSchema);
