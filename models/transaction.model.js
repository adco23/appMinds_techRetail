import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  receiptId:     { type: String, required: true },
  grossAmount:   { type: Number, required: true },
  feeAmount:     { type: Number },
  netAmount:     { type: Number },
  date:          { type: Date,   default: Date.now },
  status:        { type: String, required: true },
  paymentMethod: { type: String, required: true },
  gatewayRef:    { type: String, required: true },
  saleId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
});

transactionSchema.pre('save', async function() {
  try {
    const Order = mongoose.model('Order');
    const Subscription = mongoose.model('Subscription');
    const Plan = mongoose.model('Plan');

    let commissionRate = 0.02;

    // 1. Buscamos la orden
    const order = await Order.findById(this.saleId);
    console.log("=== DEBUG 1: ORDEN ENCONTRADA ===", order);

    if (order && order.storeId) {
      console.log("=== DEBUG 2: STORE ID DE LA ORDEN ===", order.storeId);

      // 2. Buscamos la suscripción activa
      // ATENCIÓN: Si en la base de datos el storeId se guardó como String, a veces requiere convertirlo
      const sub = await Subscription.findOne({
        storeId: order.storeId,
        status: 'Activa'
      });
      console.log("=== DEBUG 3: SUSCRIPCIÓN ENCONTRADA ===", sub);

      if (sub) {
        // 3. Buscamos el plan
        const plan = await Plan.findOne({ name: sub.detail });
        console.log("=== DEBUG 4: PLAN ENCONTRADO ===", plan);

        if (plan && plan.commission) {
          commissionRate = parseFloat(plan.commission) / 100;
          console.log("=== DEBUG 5: NUEVA TASA APLICADA ===", commissionRate);
        }
      } else {
        console.log("⚠️ ALERTA: No se encontró ninguna suscripción 'Activa' para el storeId:", order.storeId);
      }
    } else {
      console.log("⚠️ ALERTA: La orden no existe o no tiene un 'storeId' asociado.");
    }

    this.feeAmount = this.grossAmount * commissionRate;
    this.netAmount = this.grossAmount - this.feeAmount;

  } catch (error) {
    throw error;
  }
});
export default mongoose.model('Transaction', transactionSchema);
