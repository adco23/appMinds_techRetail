import mongoose from "mongoose";

const commerceSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  cuit:      { type: String, required: true, unique: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String, default: null },
  address:   { type: String, default: null },
  status:    { type: Number, default: 1 }, // 1 = activo, 0 = inactivo
  createdAt: { type: Date,   default: Date.now },
});

export default mongoose.model('Commerce', commerceSchema);
