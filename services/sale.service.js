const fileHandler = require('../utils/fileHandler');
const Sale = require('../models/sale.model');

const JSON_FILE = 'sales.json';
const sales = fileHandler.readFile(JSON_FILE);

const getSales = () => {
  return sales;
};

const findById = id => {
  return sales.find(sale => sale.id === id);
};

const exists = id => {
  return sales.some(sale => sale.id === id);
};

const createSale = ({ clientId, storeId, paymentMethod, detailsId }) => {

  let newSale = new Sale(sales.length + 1, clientId, storeId, paymentMethod, detailsId);

  return fileHandler.writeFile(JSON_FILE, [...sales, newSale]);
};

const cancelSale = id => {
  const saleData = sales.find(s => s.id === id);

  const sale = Object.assign(new Sale(), saleData);
  sale.cancel();

  const list = sales.map(s => s.id === id ? sale : s);

  return fileHandler.writeFile(JSON_FILE, list);
};

// const updateSale = (id, { name, email, phone, address }) => {
//   const sale = findById(id);

//   if (!sale) return false;

//   sale.name = name || sale.name;
//   sale.email = email || sale.email;
//   sale.phone = phone || sale.phone;
//   sale.address = address || sale.address;

//   fileHandler.writeFile(JSON_FILE, sales);
//   return true;
// }

module.exports = { exists, findById, cancelSale, getSales, createSale };
