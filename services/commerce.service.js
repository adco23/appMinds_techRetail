const fileHandler = require('../utils/fileHandler');
const Commerce = require('../models/commerce.model');

const JSON_FILE = 'commerces.json';
const commerces = fileHandler.readFile(JSON_FILE);

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

  fileHandler.writeFile(JSON_FILE, [...commerces, newCommerce]);

  return true;
};

const deleteCommerce = cuit => {
  const index = commerces.findIndex(commerce => Number(commerce.cuit) === Number(cuit));

  if (index === -1) return false;

  const list = commerces.filter((_, i) => i !== index);

  const result = fileHandler.writeFile(JSON_FILE, list);

  return result;
};

const updateCommerce = (cuit, { name, email, phone, address }) => {
  const commerce = findByCuit(cuit);

  if (!commerce) return false;

  commerce.name = name || commerce.name;
  commerce.email = email || commerce.email;
  commerce.phone = phone || commerce.phone;
  commerce.address = address || commerce.address;

  fileHandler.writeFile(JSON_FILE, commerces);
  return true;
}

module.exports = { getCommerce, createCommerce, existsByCuit, findByCuit, deleteCommerce, updateCommerce };
