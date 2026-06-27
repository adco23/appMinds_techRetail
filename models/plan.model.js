import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
name:       { type: String, required: true },
price:      { type: String, required: true },
status:     { type: String, default: 'active' },
createdAt:  { type: String },
minimum:    { type: String },
commission: { type: String },
});

export default mongoose.model('Plan', planSchema, 'plans');
