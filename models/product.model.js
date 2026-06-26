import mongoose from "mongoose";
import { decimal128ToJSON } from "../utils/decimal.helper.js";

const { Decimal128 } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema(
  {
    name:        { type: String,    required: true },
    description: { type: String,    required: true },
    price:       { type: Decimal128, required: true },
    stock:       { type: Number,    required: true, min: 0 },
    category:    { type: String,    required: true },
    storeId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    status:      { type: String,    required: true, enum: ['active', 'inactive'] },
  },
  decimal128ToJSON
);

export default mongoose.model('Product', productSchema);
