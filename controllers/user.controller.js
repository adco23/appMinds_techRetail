const userService = require('../services/user.service');

const getUsers = (req, res) => {
  try {
    const users = userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const createUser = (req, res) => {
  try {
    const { firstName, lastName, email, password, commerceId } = req.body;
    if (!firstName || !lastName || !email || !password || !commerceId) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    if (userService.existsByEmail(email)) {
      return res.status(400).json({ error: 'El email ya existe' });
    }
    const newUser = userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

const updateUser = (req, res) => {
  try {
    const { email } = req.params;
    const success = userService.updateUser(email, req.body);
    if (success) {
      return res.status(200).json({ message: 'Usuario actualizado correctamente' });
    }
    res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

const activateUser = (req, res) => {
  try {
    const { email } = req.params;
    if (userService.activateUser(email)) {
      return res.status(200).json({ message: 'OK' });
    }
    res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
};

const deactivateUser = (req, res) => {
  try {
    const { email } = req.params;
    if (userService.deactivateUser(email)) {
      return res.status(200).json({ message: 'OK' });
    }
    res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
};

const deleteUser = (req, res) => {
  try {
    const { email } = req.params;
    if (userService.deleteUser(email)) {
      return res.status(200).json({ message: 'OK' });
    }
    res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  activateUser,
  deactivateUser,
  deleteUser,
};
