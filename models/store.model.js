import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: { type: String,
    required: [true, 'El nombre es obligatorio'] },
  category: { type: String,
    required: [true, 'La categoría es obligatoria'] },
  subdomain: { type: String,
    required: [true, 'El subdominio es obligatorio'], unique: true },
  status: { type: String,
    required: [true, 'El estado es obligatorio'] },
  commerceId: { type: mongoose.Schema.Types.ObjectId,
    ref: 'Commerce',
    required: [true, 'El ID del comercio es obligatorio'] },
},
{ timestamps: true }
);

export default mongoose.model('Store', storeSchema);
