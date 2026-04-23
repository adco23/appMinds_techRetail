const Subscription = require('../models/subscription.js');
const fileHandler = require('../utils/fileHandler');
const FILE_PATH = 'subscriptions.json';

const getAll = async () => {
    return await fileHandler.readFile(FILE_PATH);
};

// 1. NUEVA SUSCRIPCIÓN

const crear = async (data) => {
    const subscriptions = await getAll();
    const nuevoId = subscriptions.length > 0 ? subscriptions[subscriptions.length - 1].id + 1 : 1;

    const hoy = new Date();
    const startDate = hoy.toISOString().split('T')[0];

    const vencimiento = new Date();
    vencimiento.setDate(hoy.getDate() + 30);
    const expDate = vencimiento.toISOString().split('T')[0];

    const nuevaSub = new Subscription(
        nuevoId,
        data.detail,
        Number(data.amount),
        startDate,
        expDate,
        'active',
        Number(data.storeId)
    );

    subscriptions.push(nuevaSub);
    await fileHandler.writeFile(FILE_PATH, subscriptions);
    return nuevaSub;
};

// 2. RENOVAR
const renovar = async (id) => {
    const subscriptions = await getAll();
    const index = subscriptions.findIndex(s => s.id === parseInt(id));

    if (index !== -1) {
        // Se renueva por 30 días
        let currentExp = new Date(subscriptions[index].expDate);
        currentExp.setDate(currentExp.getDate() + 30);

        subscriptions[index].expDate = currentExp.toISOString().split('T')[0];
        subscriptions[index].status = 'active';

        await fileHandler.writeFile(FILE_PATH, subscriptions);
        return subscriptions[index];
    }
    throw new Error('Suscripción no encontrada');
};

// 3. CANCELAR
const cancelar = async (id) => {
    const subscriptions = await getAll();
    const index = subscriptions.findIndex(s => s.id === parseInt(id));

    if (index !== -1) {
        subscriptions[index].status = 'cancelled';
        await fileHandler.writeFile(FILE_PATH, subscriptions);
        return subscriptions[index];
    }
    throw new Error('Suscripción no encontrada');
};

module.exports = {
    getAll,
    crear,
    renovar,
    cancelar
};
