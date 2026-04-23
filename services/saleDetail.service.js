const fileHandler = require('../utils/fileHandler');
const SaleDetail = require('../models/saleDetail.model');

const JSON_FILE = 'saleDetail.json';

const getDetails = () => {
    try {
        const data = fileHandler.readFile(JSON_FILE);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
};

const getDetailsBySaleId = (saleId) => {
    const details = getDetails();
    return details.filter(d => d.ventaId == saleId);
};

const createDetail = (data) => {
    const details = getDetails();

    const newDetail = new SaleDetail(
        details.length + 1,
        data.cantidad,
        data.precioUnitario,
        data.ventaId,
        data.productoId
    );

    details.push(newDetail);
    fileHandler.writeFile(JSON_FILE, details);
    return newDetail;
};

const deleteDetail = (id) => {
    const details = getDetails();
    const filteredDetails = details.filter(d => d.id != id);

    if (details.length === filteredDetails.length) return false;

    fileHandler.writeFile(JSON_FILE, filteredDetails);
    return true;
};

module.exports = {
    getDetails,
    getDetailsBySaleId,
    createDetail,
    deleteDetail
};
