import transactionService from "../services/transaction.service.js";

const getAll = async (req, res) => {
  try {
    const data = await transactionService.getAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener transacciones', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const result = await transactionService.createTransaction(req.body);
    res.status(201).json({
      message: 'Transacción creada exitosamente',
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la transacción', error: error.message });
  }
};

export default {
  getAll,
  create,
};
