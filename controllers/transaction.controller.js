const transactionService = require('../services/transaction.service');


const getAll = async (req, res) => {
    try {
        const data = await transactionService.getAll();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error: error.message });
    }
};


const create = async (req, res) => {
    try {
        const result = await transactionService.createTransaction(req.body);
        res.status(201).json({
            message: "Transaction created successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating transaction", error: error.message });
    }
};


module.exports = {
    getAll,
    create
};
