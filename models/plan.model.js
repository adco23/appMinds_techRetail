import mongoose from 'mongoose';
import { decimal128ToJSON } from '../utils/decimal.helper.js';

const { Decimal128 } = mongoose.Schema.Types;

const planSchema = new mongoose.Schema(
  {
    name:      { type: String,    required: true },
    precio:    { type: Decimal128, required: true },
    minimo:    { type: String },
    status:    { type: String,   default: 'active' },
    createdAt: { type: String },
  },
  decimal128ToJSON
);

export default mongoose.model('Plan', planSchema, 'planes');
