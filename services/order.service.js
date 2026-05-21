const Order = require('../models/order.model');

const getOrders = async () => {
  const orders = await Order.find();

  // Equivalente a dateOnlyFormat() y currencyFormat() de la clase
  return orders.map(order => {
    const obj = order.toObject();

    const d = new Date(obj.date);
    const day   = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year  = d.getFullYear();
    obj.date = `${day}/${month}/${year}`;

    obj.totalAmount = '$' + (obj.totalAmount ? obj.totalAmount : '0.00');

    return obj;
  });
};

const findById = async id => {
  return await Order.findById(id);
};

const exists = async id => {
  const order = await Order.findById(id);
  return !!order;
};

const createOrder = async ({ clientId, storeId, paymentMethod, detailsId }) => {
  const newOrder = new Order({ clientId, storeId, paymentMethod, detailsId });
  return await newOrder.save();
};

// Equivalente a order.cancel()
const cancelOrder = async id => {
  const order = await Order.findById(id);
  if (!order) throw new Error('Order not found');

  order.status = 2;
  return await order.save();
};

// Equivalente a order.complete()
const completeOrder = async (id, paymentId, logisticsId) => {
  const order = await Order.findById(id);
  if (!order) throw new Error('Order not found');

  order.status      = 1;
  order.paymentId   = paymentId;
  order.logisticsId = logisticsId;
  return await order.save();
};

const updateOrder = async (id, status) => {
  if (status == 2) return await cancelOrder(id);
  return await Order.findByIdAndUpdate(id, { status }, { new: true });
};

module.exports = {
  getOrders,
  findById,
  exists,
  createOrder,
  cancelOrder,
  completeOrder,
  updateOrder,
};
