const User = require('../models/user.model');

const getUsers = async () => {
  return await User.find();
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
    password:   data.password,
    role:       data.role,
    commerceId: data.commerceId || null,
  });

  return await newUser.save();
};

// Equivalente a user.activate()
const activateUser = async email => {
  const user = await findByEmail(email);
  if (!user) return false;

  user.status = 'active';
  await user.save();
  return true;
};

// Equivalente a user.deactivate()
const deactivateUser = async email => {
  const user = await findByEmail(email);
  if (!user) return false;

  user.status = 'inactive';
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
  user.password   = newData.password   || user.password;
  user.role       = newData.role       || user.role;
  user.commerceId = newData.commerceId || user.commerceId;

  await user.save();
  return true;
};

// Equivalente a user.validateCredentials()
const validateCredentials = async (email, password) => {
  const user = await findByEmail(email);
  if (!user) return false;
  return user.password === password;
};

module.exports = {
  getUsers,
  findByEmail,
  existsByEmail,
  createUser,
  activateUser,
  deactivateUser,
  deleteUser,
  updateUser,
  validateCredentials,
};
