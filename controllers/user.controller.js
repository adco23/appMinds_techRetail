import * as userService from "../services/user.service.js";

export const getUsers = (req, res, next) => {
  try {
    const users = userService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = (req, res, next) => {
  try {
    const newUser = userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};