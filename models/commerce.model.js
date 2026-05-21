const mongoose = require('mongoose');

const commerceSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  cuit:      { type: String, required: true, unique: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String, default: null },
  address:   { type: String, default: null },
  status:    { type: Number, default: 0 }, // 1 = active, 0 = inactive
  createdAt: { type: Date,   default: Date.now },
});

module.exports = mongoose.model('Commerce', commerceSchema);
