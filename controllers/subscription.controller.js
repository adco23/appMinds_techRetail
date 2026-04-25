const subscriptionService = require('../services/subscription.service');

const getAllSubscriptions = async (req, res) => {
  try {
    const data = await subscriptionService.getAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions' });
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
    res.status(500).json({ message: 'Error creating subscription' });
  }
};

module.exports = {
  getAllSubscriptions,
  createSubscription,
};
