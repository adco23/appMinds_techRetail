const fileHandler = require('../utils/fileHandler.js');
const Usuario = require('../models/User.js');

let users = fileHandler.readFile('users.json') || [];

const getAllUsers = () => {
  return users;
};

const createUser = data => {
  if (!data.nombre || !data.email || !data.password) {
    throw new Error('Nombre, email y contraseña son obligatorios');
  }

  const nuevoUsuario = new Usuario(
    users.length > 0 ? users[users.length - 1].id + 1 : 1,
    data.nombre,
    data.apellido,
    data.email,
    data.password,
    data.rol || 'user',
    data.comercioId || null,
    'activo'
  );

    users.push(nuevoUsuario);

    fileHandler.writeFile('users.json', users);

  return nuevoUsuario;
};

module.exports = {
  getAllUsers,
  createUser,
};
