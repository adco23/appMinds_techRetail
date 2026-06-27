import productService from './product.service.js';
import Order from "../models/order.model.js";
import transactionService from './transaction.service.js';
import mongoose from 'mongoose';
import SaleDetail from "../models/saleDetail.model.js";

export const getOrders = async () => {
  const orders = await Order.find();

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

export const createOrder = async ({ clientId, storeId, paymentMethod, products }) => {

  const newOrder = new Order({
    clientId: new mongoose.Types.ObjectId(clientId),
    storeId: new mongoose.Types.ObjectId(storeId),
    paymentMethod,
    detailsId: [],
    totalAmount: 0,
    paymentId:   `PAY-${Date.now()}`,
    logisticsId: `LOG-${Date.now()}`,
  });

  const savedOrder = await newOrder.save();

  const detailsIds = [];
  let totalOrden = 0;

  if (products && Array.isArray(products)) {
    for (const item of products) {
      if (item.productId && item.quantity) {
        const prod = await productService.getProductById(item.productId);

        const detail = new SaleDetail({
          cantidad: Number(item.quantity),
          precioUnitario: prod.price,
          ventaId: savedOrder._id,
          productoId: new mongoose.Types.ObjectId(item.productId),
        });

        await detail.save();

        detailsIds.push(detail._id);
        totalOrden += detail.subtotal;
      }
    }
  }

  savedOrder.detailsId = detailsIds;
  savedOrder.totalAmount = totalOrden;

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
    let porcentajeComision = 0.02;

    try {
      const suscripcionTienda = await mongoose.model('Subscription').findOne({
        storeId: order.storeId,
        status: 'active'
      }).sort({ _id: -1 }).populate('planId');

      if (suscripcionTienda && suscripcionTienda.planId && suscripcionTienda.planId.porcentaje) {
        porcentajeComision = suscripcionTienda.planId.porcentaje / 100;
      } else if (suscripcionTienda && suscripcionTienda.porcentaje) {
        porcentajeComision = suscripcionTienda.porcentaje / 100;
      }
    } catch (error) {
      console.log("No se pudo obtener la comisión personalizada, aplicando 2%:", error.message);
    }

    const totalBruto = order.totalAmount || 0;
    const comisionCalculada = totalBruto * porcentajeComision;
    const montoNeto = totalBruto - comisionCalculada;

    await transactionService.createTransaction({
      receiptId:     `REC-${order._id.toString().slice(-6).toUpperCase()}`,
      grossAmount:   totalBruto,
      commission:    comisionCalculada,
      netAmount:     montoNeto,
      status:        'approved',
      paymentMethod: order.paymentMethod,
      gatewayRef:    `GW-${Date.now()}`,
      saleId:        order._id,
    });

  }

  return order;
};
