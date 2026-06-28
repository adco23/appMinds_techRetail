import * as service from "../services/order.service.js";
import { validate } from "../utils/validations.js";
import productService from "../services/product.service.js";
import mongoose from "mongoose"; // Para cargar modelos si hiciese falta

export const getOrders = async (req, res, next) => {
  try {
    const { id } = req.query;
    if (id) {
      const order = await service.findById(id);
      if (!order) return res.status(404).json({ error: 'Orden no encontrada.' });
      return res.json(order);
    }
    res.json(await service.getOrders());
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res) => {
  try {
    const { clientId, storeId, paymentMethod, detailsId, totalAmount, products } = req.body;

    const tieneProductosValidos = products && products.length > 0 && products[0].productId !== "";

    const validations = [
      { condition: !clientId,      message: 'El ID del cliente es obligatorio.' },
      { condition: !storeId,       message: 'El ID de la tienda es obligatorio.' },
      { condition: !paymentMethod, message: 'El método de pago es obligatorio.' },
      { condition: !detailsId && !tieneProductosValidos, message: 'Tenés que seleccionar al menos un producto.' },
    ];

    if (!validate(validations, res)) return;

    const statusCreated = await service.createOrder({
      clientId,
      storeId,
      paymentMethod,
      detailsId,
      totalAmount,
      products
    });

    if (!statusCreated) return res.status(500).json({ error: 'Error al registrar la Orden.' });

    if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {

      const simQuery = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
      return res.redirect(`/orders${simQuery}`);
    }


    return res.status(201).json({ message: 'Orden (pendiente) registrada exitosamente.' });

  } catch (error) {
    console.error("Error en createOrder:", error);
    return res.status(500).json({ error: 'Ocurrió un error interno en el servidor.' });
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { status } = req.query;

    if (!id) return res.status(400).json({ error: 'El ID de la Orden es obligatorio.' });
    if (isNaN(status)) return res.status(400).json({ error: 'El estado de la orden debe ser numérico.' });

    status = parseInt(status);

    const order = await service.findById(id);
    if (!order) return res.status(404).json({ error: 'Orden no encontrada.' });

    // Este control ataja el error que vimos en pantalla ("La orden no puede ser modificada")
    if (order.status != 0) return res.status(400).json({ error: 'La orden no puede ser modificada.' });

    const result = await service.updateOrder(id, status);
    if (!result) return res.status(500).json({ error: 'Error al modificar la Orden.' });
    res.json({ message: 'Orden actualizada exitosamente.' });
  } catch (error) {
    next(error);
  }
};
