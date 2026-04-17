let users = [
  { id: 1, name: 'Juan' },
  { id: 2, name: 'Ana' },
];

const getAllUsers = () => {
  return users;
};

const createUser = (data) => {
  if (!data.name) {
    throw new Error('El nombre es obligatorio');
  }

  const newUser = {
    id: users.length + 1,
    name: data.name,
  };

  users.push(newUser);
  return newUser;
};

module.exports = {
  getAllUsers,
  createUser,
};
