const fileHandler = require('../utils/fileHandler');
const User = require('../models/user.model');

const JSON_FILE = 'users.json';

const getUsers = () => {
  try {
    const data = fileHandler.readFile(JSON_FILE);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

const findByEmail = email => {
  const users = getUsers();
  const searchEmail = email.trim().toLowerCase();
  return users.find(u => (u.email || '').trim().toLowerCase() === searchEmail);
};

const existsByEmail = email => {
  return !!findByEmail(email);
};

const createUser = data => {
  const users = getUsers();
  const newUser = new User(
    users.length + 1,
    data.firstName,
    data.lastName,
    data.email,
    data.password,
    data.role,
    data.commerceId,
  );
  users.push(newUser);
  fileHandler.writeFile(JSON_FILE, users);
  return newUser;
};

const activateUser = email => {
  const users = getUsers();
  const searchEmail = email.trim().toLowerCase();
  const index = users.findIndex(u => (u.email || '').trim().toLowerCase() === searchEmail);
  if (index === -1) return false;

  const user = users[index];
  const userObj = new User(
    user.id,
    user.firstName,
    user.lastName,
    user.email,
    user.password,
    user.role,
    user.commerceId,
    user.status,
  );
  userObj.activate();
  users[index] = userObj;

  fileHandler.writeFile(JSON_FILE, users);
  return true;
};

const deactivateUser = email => {
  const users = getUsers();
  const searchEmail = email.trim().toLowerCase();
  const index = users.findIndex(u => (u.email || '').trim().toLowerCase() === searchEmail);
  if (index === -1) return false;

  const user = users[index];
  const userObj = new User(
    user.id,
    user.firstName,
    user.lastName,
    user.email,
    user.password,
    user.role,
    user.commerceId,
    user.status,
  );
  userObj.deactivate();
  users[index] = userObj;

  fileHandler.writeFile(JSON_FILE, users);
  return true;
};

const deleteUser = email => {
  const users = getUsers();
  const searchEmail = email.trim().toLowerCase();
  const filteredUsers = users.filter(u => (u.email || '').trim().toLowerCase() !== searchEmail);

  if (users.length === filteredUsers.length) return false;

  fileHandler.writeFile(JSON_FILE, filteredUsers);
  return true;
};

const updateUser = (email, newData) => {
  const users = getUsers();
  const index = users.findIndex(u => (u.email || '').trim().toLowerCase() === email.trim().toLowerCase());

  if (index === -1) return false;

  const userActual = users[index];

  // Mantenemos el ID y el email original, actualizamos el resto
  users[index] = {
    ...userActual,
    firstName: newData.firstName || userActual.firstName,
    lastName: newData.lastName || userActual.lastName,
    password: newData.password || userActual.password,
    role: newData.role || userActual.role,
    commerceId: newData.commerceId || userActual.commerceId,
  };

  fileHandler.writeFile(JSON_FILE, users);
  return true;
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
};
