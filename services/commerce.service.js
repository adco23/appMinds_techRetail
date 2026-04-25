const fileHandler = require('../utils/fileHandler');
const Commerce = require('../models/commerce.model');

const JSON_FILE = 'commerces.json';
const commerces = fileHandler.readFile(JSON_FILE);

const save = data => {
  try {
    fileHandler.writeFile(JSON_FILE, data);
    return true;
  } catch (error) {
    console.error('Error saving commerces:', error);
    return false;
  }
};

const getCommerce = () => {
  return commerces;
};

const findByCuit = cuit => {
  return commerces.find(commerce => commerce.cuit === cuit);
};

const existsByCuit = cuit => {
  return commerces.some(commerce => commerce.cuit === cuit);
};

const createCommerce = ({ name, cuit, email, phone, address }) => {
  let newCommerce = new Commerce(commerces.length + 1, name, cuit, email, phone, address);

  return save([...commerces, newCommerce]);
};

const deleteCommerce = cuit => {
  const commerce = commerces.find(commerce => commerce.cuit === cuit);

  if (!commerce) return false;

  const updated = new Commerce(
    commerce.id,
    commerce.name,
    commerce.cuit,
    commerce.email,
    commerce.phone,
    commerce.address,
  );
  updated.deactivate();

  const list = commerces.map(c => (c.cuit === cuit ? updated : c));

  return save(list);
};

const updateCommerce = (cuit, { name, email, phone, address }) => {
  const commerce = findByCuit(cuit);

  if (!commerce) return false;

  commerce.name = name || commerce.name;
  commerce.email = email || commerce.email;
  commerce.phone = phone || commerce.phone;
  commerce.address = address || commerce.address;

  return save([...commerces.map(c => (c.cuit === cuit ? commerce : c))]);
};

const activate = id => {
  const commerce = commerces.find(c => c.id == id);
  commerce.status = 1;

  return save([...commerces.map(c => (c.id == id ? commerce : c))]);
};

module.exports = { getCommerce, createCommerce, existsByCuit, findByCuit, deleteCommerce, updateCommerce, activate };
