import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  precio:  { type: String, required: true },
  minimo: { type: String },
  status:  { type: String, default: 'active' },
  createdAt: { type: String },
});

export default mongoose.model('Plan', planSchema, 'planes');
