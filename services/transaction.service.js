const fileHandler = require('../utils/fileHandler');
const FILE_PATH = 'transactions.json';

const getAll = async () => {
    return await fileHandler.readFile(FILE_PATH);
};

const createTransaction = async (data) => {
    const transactions = await fileHandler.readFile(FILE_PATH);

    // Cálculo de comisión (2%) y neto
    const fee = data.grossAmount * 0.02;
    const net = data.grossAmount - fee;

    const newTransaction = {
        id: transactions.length > 0 ? transactions[transactions.length - 1].id + 1 : 1,
        ...data,
        feeAmount: fee,
        netAmount: net,
        date: new Date().toISOString()
    };

    transactions.push(newTransaction);
    await fileHandler.writeFile(FILE_PATH, transactions);
    return newTransaction;
};

// EXPORTAR AMBAS
module.exports = {
    getAll,
    createTransaction
};
