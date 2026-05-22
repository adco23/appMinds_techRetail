import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  role:       { type: String, required: true },
  commerceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Commerce', default: null },
  status:     { type: String, default: 'active', enum: ['active', 'inactive'] },
});

export default mongoose.model('User', userSchema);
