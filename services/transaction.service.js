import Transaction from "../models/transaction.model.js";

const getAll = async () => {
  const txs = await Transaction.find();
  return txs.map(tx => {
    const obj = tx.toJSON();
    obj.grossAmount = parseFloat(obj.grossAmount || '0');
    obj.feeAmount   = parseFloat(obj.feeAmount   || '0');
    obj.netAmount   = parseFloat(obj.netAmount   || '0');
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

  return await newTransaction.save();
};

export default { getAll, createTransaction };
