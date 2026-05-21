const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String,  required: true },
  description: { type: String,  required: true },
  price:       { type: Number,  required: true, min: 0 },
  stock:       { type: Number,  required: true, min: 0 },
  category:    { type: String,  required: true },
  storeId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  status:      { type: String,  required: true, enum: ['active', 'inactive'] },
});

module.exports = mongoose.model('Product', productSchema);
