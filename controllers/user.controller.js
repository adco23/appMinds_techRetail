const userService = require('../services/user.service');

const getUsers = (req, res) => {
  res.json(userService.getUsers());
};

const createUser = (req, res) => {
  try {
    const newUser = userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
};

const activateUser = (req, res) => {
  try {
    const { email } = req.params;
    if (userService.activateUser(email)) return res.status(200).json({ message: 'OK' });
    res.status(404).json({ error: 'Not Found' });
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
};

const deactivateUser = (req, res) => {
  try {
    const { email } = req.params;
    if (userService.deactivateUser(email)) return res.status(200).json({ message: 'OK' });
    res.status(404).json({ error: 'Not Found' });
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
};

const deleteUser = (req, res) => {
  try {
    const { email } = req.params;
    if (userService.deleteUser(email)) return res.status(200).json({ message: 'OK' });
    res.status(404).json({ error: 'Not Found' });
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
};

module.exports = { getUsers, createUser, activateUser, deactivateUser, deleteUser };
