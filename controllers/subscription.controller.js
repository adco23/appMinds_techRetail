import subscriptionService from "../services/subscription.service.js";

const getAllSubscriptions = async (req, res) => {
  try {
    const data = await subscriptionService.getAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo suscripciones', error: error.message });
  }
};

const createSubscription = async (req, res) => {
  try {
    const newSub = await subscriptionService.crear(req.body);
    res.status(201).json({
      message: 'Subscription created successfully',
      data: newSub,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando suscripción', error: error.message });
  }
};

export default {
  getAllSubscriptions,
  createSubscription,
};
