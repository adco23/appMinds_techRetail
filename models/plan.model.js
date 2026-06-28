import mongoose from 'mongoose';
import { toD128, decimal128ToJSON } from '../utils/decimal.helper.js';

const { Decimal128 } = mongoose.Schema.Types;

const planSchema = new mongoose.Schema({
  name:       { type: String,    required: true },
  price:      { type: Decimal128, required: true },
  minimum:    { type: String },
  commission: { type: Decimal128 },
  status:     { type: String,   default: 'active' },
  createdAt:  { type: String },
}, decimal128ToJSON);

export default mongoose.model('Plan', planSchema, 'plans');
