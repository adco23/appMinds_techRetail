import Order from "../models/order.model.js";
import transactionService from './transaction.service.js';

export const getOrders = async () => {
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

export const findById = async id => {
  return await Order.findById(id);
};

export const exists = async id => {
  const order = await Order.findById(id);
  return !!order;
};

export const createOrder = async ({ clientId, storeId, paymentMethod, detailsId, totalAmount }) => {
  const newOrder = new Order({
    clientId,
    storeId,
    paymentMethod,
    detailsId: detailsId || [],
    totalAmount,
    paymentId:   `PAY-${Date.now()}`,
    logisticsId: `LOG-${Date.now()}`,
  });
  return await newOrder.save();
};

// Equivalente a order.cancel()
export const cancelOrder = async id => {
  const order = await Order.findById(id);
  if (!order) throw new Error('Order not found');

  order.status = 2;
  return await order.save();
};

// Equivalente a order.complete()
export const completeOrder = async (id, paymentId, logisticsId) => {
  const order = await Order.findById(id);
  if (!order) throw new Error('Order not found');

  order.status      = 1;
  order.paymentId   = paymentId;
  order.logisticsId = logisticsId;
  return await order.save();
};

export const updateOrder = async (id, status) => {
  if (status == 2) return await cancelOrder(id);

  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

  if (status == 1 && order) {
    await transactionService.createTransaction({
      receiptId:     `REC-${order._id.toString().slice(-6).toUpperCase()}`,
      grossAmount:   order.totalAmount || 0,
      status:        'approved',
      paymentMethod: order.paymentMethod,
      gatewayRef:    `GW-${Date.now()}`,
      saleId:        order._id,
    });
  }

  return order;
};
