import Transaction from "../models/transaction.model.js";


export const getAll = async () => {
  const transactions = await Transaction.find().populate('saleId');

  return transactions.map(tx => {
    const obj = tx.toObject();

    if (obj.date) {
      // Creamos el objeto de fecha nativo
      const d = new Date(obj.date);

      // Convertimos a string usando la zona horaria local de Argentina (America/Argentina/Buenos_Aires)
      // Esto evita de forma matemática que se pase al día de mañana si se creó a la noche
      obj.date = d.toLocaleDateString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else {
      obj.date = 'No date';
    }

    return obj;
  });
};

const createTransaction = async data => {
  const newTransaction = new Transaction({
    receiptId:     data.receiptId,
    grossAmount:   data.grossAmount,
    status:        data.status,
    paymentMethod: data.paymentMethod,
    gatewayRef:    data.gatewayRef,
    saleId:        data.saleId,
  });

  return await newTransaction.save(); // pre('save') calcula feeAmount y netAmount
};

export default { getAll, createTransaction };
