import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const getUsers = async () => {
  return await User.find().populate('commerceId');
};

const findByEmail = async email => {
  return await User.findOne({ email: email.trim().toLowerCase() });
};

const existsByEmail = async email => {
  const user = await findByEmail(email);
  return !!user;
};

const createUser = async data => {
  const newUser = new User({
    firstName:  data.firstName,
    lastName:   data.lastName,
    email:      data.email.trim().toLowerCase(),
    password:   await bcrypt.hash(data.password, 10),
    role:       data.role,
    commerceId: data.commerceId || null,
  });

  return await newUser.save();
};

// Equivalente a user.activate()
const activateUser = async email => {
  const user = await findByEmail(email);
  if (!user) return false;

  user.status = 'Activo';
  await user.save();
  return true;
};

// Equivalente a user.deactivate()
const deactivateUser = async email => {
  const user = await findByEmail(email);
  if (!user) return false;

  user.status = 'Inactivo';
  await user.save();
  return true;
};

const deleteUser = async email => {
  const user = await User.findOneAndDelete({ email: email.trim().toLowerCase() });
  return !!user;
};

const updateUser = async (email, newData) => {
  const user = await findByEmail(email);
  if (!user) return false;

  user.firstName  = newData.firstName  || user.firstName;
  user.lastName   = newData.lastName   || user.lastName;

  if (newData.password) {
    user.password = await bcrypt.hash(newData.password, 10);
  }

  user.role       = newData.role       || user.role;
  user.commerceId = newData.commerceId || user.commerceId;

  // Normalizar status de datos viejos del JSON
  if (user.status === 'active')   user.status = 'Activo';
  if (user.status === 'inactive') user.status = 'Inactivo';

  await user.save();
  return true;
};

const assignCommerceToUser = async (email, commerceId) => {
  const user = await findByEmail(email);
  if (!user) return false;

  user.commerceId = commerceId;
  await user.save();
  return user;
};

const validateCredentials = async (email, password) => {
  const user = await findByEmail(email);

  if (!user) return false;
  if (user.status !== 'Activo') return false;

  const isMatch = await bcrypt.compare(password, user.password);

  return isMatch ? user : false;
};

export default {
  getUsers,
  findByEmail,
  existsByEmail,
  createUser,
  activateUser,
  deactivateUser,
  deleteUser,
  updateUser,
  assignCommerceToUser,
  validateCredentials,
};
