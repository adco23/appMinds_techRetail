import mongoose from "mongoose";
import { decimal128ToJSON } from "../utils/decimal.helper.js";

const { Decimal128 } = mongoose.Schema.Types;

const subscriptionSchema = new mongoose.Schema(
  {
    detail:    { type: String,    required: true },
    amount:    { type: Decimal128, required: true },
    startDate: { type: String,   required: true },
    expDate:   { type: String,   required: true },
    status:    { type: String,   default: 'Activa', enum: ['Activa', 'Cancelada'] },
    storeId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  },
  decimal128ToJSON
);

export default mongoose.model('Subscription', subscriptionSchema);
