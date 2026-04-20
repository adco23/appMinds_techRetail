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

  return commerces;
};

module.exports = { getCommerce, createCommerce };
