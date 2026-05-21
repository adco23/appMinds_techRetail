const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String,
    required: [true, 'El nombre es obligatorio'] },
  category: { type: String,
    required: [true, 'La categoría es obligatoria'] },
  subdomain: { type: String,
    required: [true, 'El subdominio es obligatorio'], unique: true },
  status: { type: String,
    required: [true, 'El estado es obligatorio'] },
  commerceId: { type: Number,
    required: [true, 'El ID del comercio es obligatorio'] },
  createdAt: { type: String,
    required: [true, 'La fecha de creación es obligatoria'] },
},
{ timestamps: true }
);

module.exports = mongoose.model('Store', storeSchema);
