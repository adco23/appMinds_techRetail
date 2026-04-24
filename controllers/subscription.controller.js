const subscriptionService = require('../services/subscription.service');

const getAllSubscriptions = async (req, res) => {
    try {
        const data = await subscriptionService.getAll();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subscriptions" });
    }
};

const createSubscription = async (req, res) => {
    try {
        const newSub = await subscriptionService.create(req.body);
        res.status(201).json({
            message: "Subscription created successfully",
            data: newSub
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating subscription" });
    }
};

const renewSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSub = await subscriptionService.renew(id);
        res.status(200).json({ message: "Suscripción renovada", data: updatedSub });
    } catch (error) {
        res.status(500).json({ message: "Error al renovar" });
    }
};

const cancelSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSub = await subscriptionService.cancel(id);
        res.status(200).json({ message: "Suscripción cancelada", data: updatedSub });
    } catch (error) {
        res.status(500).json({ message: "Error al cancelar" });
    }
};

module.exports = {
    getAllSubscriptions,
    createSubscription,
    renewSubscription,
    cancelSubscription
};
