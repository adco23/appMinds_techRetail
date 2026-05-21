const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  role:       { type: String, required: true },
  commerceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Commerce', default: null },
  status:     { type: String, default: 'Activo', enum: ['Activo', 'Inactivo'] },
});

module.exports = mongoose.model('User', userSchema);
