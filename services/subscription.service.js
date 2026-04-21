const fileHandler = require('../utils/fileHandler');
const FILE_PATH = 'subscriptions.json';

const getAll = async () => {
    const data = await fileHandler.readFile(FILE_PATH);
    return data;
};

const getById = async (id) => {
    const subscriptions = await fileHandler.readFile(FILE_PATH);
    return subscriptions.find(s => s.id === id);
};

const create = async (subscriptionData) => {
    const subscriptions = await fileHandler.readFile(FILE_PATH);

    // Guardo lo que viende de body
    subscriptions.push(subscriptionData);

    await fileHandler.writeFile(FILE_PATH, subscriptions);
    return subscriptionData;
};

const update = async (id, updatedData) => {
    let subscriptions = await fileHandler.readFile(FILE_PATH);
    const index = subscriptions.findIndex(s => s.id === id);

    if (index !== -1) {
        subscriptions[index] = { ...subscriptions[index], ...updatedData };
        await fileHandler.writeFile(FILE_PATH, subscriptions);
        return subscriptions[index];
    }
    return null;
};

module.exports = { getAll, getById, create, update };
