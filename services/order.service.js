import Decimal from 'decimal.js';
import { toD128, fromD128 } from '../utils/decimal.helper.js';
import productService from './product.service.js';
import Order from "../models/order.model.js";
import Store from "../models/store.model.js";
import transactionService from './transaction.service.js';
import mongoose from 'mongoose';
import SaleDetail from "../models/saleDetail.model.js";

const formatOrders = orders =>
  orders.map(order => {
    const obj = order.toJSON();
    const d = new Date(obj.date);
    obj.date = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    obj.totalAmount = '$' + (obj.totalAmount ? parseFloat(obj.totalAmount).toFixed(2) : '0.00');
    return obj;
  });

export const getOrders = async () => {
  return formatOrders(await Order.find());
};

export const getOrdersByCommerceId = async commerceId => {
  const stores = await Store.find({ commerceId }).select('_id');
  const storeIds = stores.map(s => s._id);
  return formatOrders(await Order.find({ storeId: { $in: storeIds } }));
};

export const findById = async id => {
  return await Order.findById(id)
    .populate({path: 'clientId', select: 'firstName lastName'})
    .populate({path: 'storeId', select: 'name'})
    .populate({ path: 'detailsId', populate: { path: 'productoId', select: 'name' } });
};

export const exists = async id => {
  const order = await Order.findById(id);
  return !!order;
};

export const createOrder = async ({ clientId, storeId, paymentMethod, products }) => {
  const newOrder = new Order({
    clientId:    new mongoose.Types.ObjectId(clientId),
    storeId:     new mongoose.Types.ObjectId(storeId),
    paymentMethod,
    detailsId:   [],
    totalAmount: toD128('0'),
    paymentId:   `PAY-${Date.now()}`,
    logisticsId: `LOG-${Date.now()}`,
  });

  const savedOrder = await newOrder.save();

  const detailsIds = [];
  let totalDecimal = new Decimal(0);

  if (products && Array.isArray(products)) {
    for (const item of products) {
      if (item.productId && item.quantity) {
        const prod = await productService.getProductById(item.productId);

        const detail = new SaleDetail({
          cantidad:       Number(item.quantity),
          precioUnitario: toD128(prod.price),
          ventaId:        savedOrder._id,
          productoId:     new mongoose.Types.ObjectId(item.productId),
        });

        await detail.save();
        detailsIds.push(detail._id);
        totalDecimal = totalDecimal.plus(fromD128(detail.subtotal));
      }
    }
  }

  savedOrder.detailsId   = detailsIds;
  savedOrder.totalAmount = toD128(totalDecimal);

  return await savedOrder.save();
};

export const cancelOrder = async id => {
  const order = await Order.findById(id);
  if (!order) throw new Error('Order not found');

  order.status = 2;
  return await order.save();
};

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

  const currentOrder = await Order.findById(id).populate('detailsId');
  if (!currentOrder) throw new Error('Order not found');
  if (currentOrder.status === 1) throw new Error('La orden no puede ser modificada.');

  if (status == 1) {
    for (const item of currentOrder.detailsId) {
      await productService.decreaseStock(item.productoId, item.cantidad);
    }
  }

  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

  if (status == 1 && order) {
    const grossAmount = order.totalAmount ? order.totalAmount.toString() : '0';
    await transactionService.createTransaction({
      receiptId:     `REC-${order._id.toString().slice(-6).toUpperCase()}`,
      grossAmount,
      status:        'approved',
      paymentMethod: order.paymentMethod,
      gatewayRef:    `GW-${Date.now()}`,
      saleId:        order._id,
    });
  }

  return order;
};
