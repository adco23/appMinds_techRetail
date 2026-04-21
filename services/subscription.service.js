const fileHandler = require('../utils/fileHandler');
const FILE_PATH = 'subscriptions.json';

const getAll = async () => {
    return await fileHandler.readFile(FILE_PATH);
};

// 1. NUEVA SUSCRIPCIÓN
const crear = async (newSubData) => {
    const subscriptions = await getAll();
    const newSub = {
        id: subscriptions.length > 0 ? subscriptions[subscriptions.length - 1].id + 1 : 1,
        ...newSubData,
        startDate: new Date().toISOString().split('T')[0],
        status: 'active'
    };
    subscriptions.push(newSub);
    await fileHandler.writeFile(FILE_PATH, subscriptions);
    return newSub;
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
