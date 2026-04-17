let users = [
  { id: 1, name: "Juan" },
  { id: 2, name: "Ana" }
];

export const getAllUsers = () => {
  return users;
};

export const createUser = (data) => {
  if (!data.name) {
    throw new Error("El nombre es obligatorio");
  }

  const newUser = {
    id: users.length + 1,
    name: data.name
  };

  users.push(newUser);
  return newUser;
};