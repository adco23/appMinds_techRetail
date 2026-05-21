const Transaction = require('../models/transaction.model');

const getAll = async () => {
  return await Transaction.find();
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

module.exports = { getAll, createTransaction };
