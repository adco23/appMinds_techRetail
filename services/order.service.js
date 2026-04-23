const fileHandler = require('../utils/fileHandler');
const Order = require('../models/order.model');

const JSON_FILE = 'orders.json';
const orders = fileHandler.readFile(JSON_FILE);

const getOrders = () => {
  return orders.map(sale => {
    const obj = Object.assign(new Order(), sale);
    obj.dateOnlyFormat();
    obj.currencyFormat();

    return obj;
  });
};

const findById = id => {
  return orders.find(order => order.id === id);
};

const exists = id => {
  return orders.some(order => order.id === id);
};

const createOrder = ({ clientId, storeId, paymentMethod, detailsId }) => {
  let newOrder = new Order(orders.length + 1, clientId, storeId, paymentMethod, detailsId);

  return fileHandler.writeFile(JSON_FILE, [...orders, newOrder]);
};

const updateOrder = (id, status) => {
  const data = orders.find(o => o.id === id);

  const order = Object.assign(new Order(), data);

  if (status == 2) {
    order.cancel();
  }

  const list = orders.map(o => (o.id === id ? order : o));

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

module.exports = { exists, findById, updateOrder, getOrders, createOrder };
