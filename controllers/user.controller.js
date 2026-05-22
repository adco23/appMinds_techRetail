import userService from "../services/user.service.js";

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, commerceId } = req.body;

    if (!firstName || !lastName || !email || !password || !commerceId) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    if (await userService.existsByEmail(email)) {
      return res.status(400).json({ error: 'El email ya existe' });
    }

    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const success = await userService.updateUser(email, req.body);
    if (success) return res.status(200).json({ message: 'Usuario actualizado correctamente' });
    res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

const activateUser = async (req, res) => {
  try {
    const { email } = req.params;
    if (await userService.activateUser(email)) return res.status(200).json({ message: 'OK' });
    res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const { email } = req.params;
    if (await userService.deactivateUser(email)) return res.status(200).json({ message: 'OK' });
    res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    if (await userService.deleteUser(email)) return res.status(200).json({ message: 'OK' });
    res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
};

export default { getUsers, createUser, updateUser, activateUser, deactivateUser, deleteUser };
