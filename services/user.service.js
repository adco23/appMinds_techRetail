const fileHandler = require('../utils/fileHandler.js');

let users = fileHandler.readFile('users.json');

const getAllUsers = () => {
  return users;
};

const createUser = data => {
  if (!data.name) {
    throw new Error('El nombre es obligatorio');
  }

  if (!data.email) {
    throw new Error('El email es obligatorio');
  }

  const newUser = {
    id: users.length + 1,
    name: data.name,
    email: data.email,
    role: data.role || 'user',
    storeId: data.storeId || null,
  };

  users.push(newUser);
  return newUser;
};

module.exports = {
  getAllUsers,
  createUser,
};
