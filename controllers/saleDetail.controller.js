const fs = require('fs');
const path = require('path');
const SaleDetail = require('../models/sale.detail');

const jsonPath = path.join(__dirname, '../data/saleDetails.json');

const saleDetailController = {
    registro: (req, res) => {
        res.render('saleDetails/index');
    },

    store: (req, res) => {
        const fileContent = fs.readFileSync(jsonPath, 'utf-8');
        const details = JSON.parse(fileContent || '[]');

        const nuevoDetalle = new SaleDetail(
            details.length > 0 ? details[details.length - 1].id + 1 : 1,
            req.body.cantidad,
            req.body.precioUnitario,
            req.body.ventaId,
            req.body.productoId
        );

        details.push(nuevoDetalle);
        fs.writeFileSync(jsonPath, JSON.stringify(details, null, 2));
        res.redirect('/api/saleDetail');
    },

    list: (req, res) => {
        const fileContent = fs.readFileSync(jsonPath, 'utf-8');
        const details = JSON.parse(fileContent || '[]');
        res.render('saleDetails/list', { details });
    },

    show: (req, res) => {
        const details = JSON.parse(fs.readFileSync(jsonPath, 'utf-8') || '[]');
        const detalle = details.find(d => d.id == req.params.id);
        if (detalle) res.render('saleDetails/detail', { detail: detalle });
        else res.status(404).send('Detalle no encontrado');
    },

    edit: (req, res) => {
        const details = JSON.parse(fs.readFileSync(jsonPath, 'utf-8') || '[]');
        const detalle = details.find(d => d.id == req.params.id);
        if (detalle) res.render('saleDetails/edit', { detail: detalle });
        else res.status(404).send('Detalle no encontrado');
    },

    update: (req, res) => {
        let details = JSON.parse(fs.readFileSync(jsonPath, 'utf-8') || '[]');
        const index = details.findIndex(d => d.id == req.params.id);
        if (index !== -1) {
            const detailObj = new SaleDetail(
                details[index].id, details[index].cantidad, details[index].precioUnitario,
                details[index].ventaId, details[index].productoId
            );
            detailObj.actualizar(req.body);
            details[index] = detailObj;
            fs.writeFileSync(jsonPath, JSON.stringify(details, null, 2));
            res.redirect('/api/saleDetail');
        } else res.status(404).send('Error al actualizar');
    },

    delete: (req, res) => {
        let details = JSON.parse(fs.readFileSync(jsonPath, 'utf-8') || '[]');
        const filteredDetails = details.filter(d => d.id != req.params.id);
        fs.writeFileSync(jsonPath, JSON.stringify(filteredDetails, null, 2));
        res.redirect('/api/saleDetail');
    }
};

module.exports = saleDetailController;
