const fs = require('fs');
const path = require('path');
const Usuario = require('../models/User');

const jsonPath = path.join(__dirname, '../data/users.json');

const userController = {
    registro: (req, res) => {
        res.render('users/index');
    },

    store: (req, res) => {
        const fileContent = fs.readFileSync(jsonPath, 'utf-8');
        const users = JSON.parse(fileContent || '[]');
        const nuevoUsuario = new Usuario(
            users.length > 0 ? users[users.length - 1].id + 1 : 1,
            req.body.nombre,
            req.body.apellido,
            req.body.email,
            req.body.password,
            req.body.rol,
            req.body.comercioId,
            'activo'
        );
        users.push(nuevoUsuario);
        fs.writeFileSync(jsonPath, JSON.stringify(users, null, 2));
        res.redirect('/api/user');
    },

    list: (req, res) => {
        const fileContent = fs.readFileSync(jsonPath, 'utf-8');
        const users = JSON.parse(fileContent || '[]');
        res.render('users/list', { users });
    },

    show: (req, res) => {
        const fileContent = fs.readFileSync(jsonPath, 'utf-8');
        const users = JSON.parse(fileContent || '[]');
        const usuarioEncontrado = users.find(u => u.id == req.params.id);
        if (usuarioEncontrado) {
            res.render('users/detail', { user: usuarioEncontrado });
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    },

    edit: (req, res) => {
        const fileContent = fs.readFileSync(jsonPath, 'utf-8');
        const users = JSON.parse(fileContent || '[]');
        const user = users.find(u => u.id == req.params.id);
        if (user) {
            res.render('users/edit', { user });
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    },

    update: (req, res) => {
        let users = JSON.parse(fs.readFileSync(jsonPath, 'utf-8') || '[]');
        const index = users.findIndex(u => u.id == req.params.id);
        if (index !== -1) {
            const userObj = new Usuario(
                users[index].id, users[index].nombre, users[index].apellido,
                users[index].email, users[index].password, users[index].rol,
                users[index].comercioId, users[index].estado
            );
            userObj.actualizar(req.body);
            users[index] = userObj;
            fs.writeFileSync(jsonPath, JSON.stringify(users, null, 2));
            res.redirect('/api/user');
        } else {
            res.status(404).send('Error al actualizar');
        }
    },

    delete: (req, res) => {
        let users = JSON.parse(fs.readFileSync(jsonPath, 'utf-8') || '[]');
        const index = users.findIndex(u => u.id == req.params.id);
        if (index !== -1) {
            const userObj = new Usuario(
                users[index].id, users[index].nombre, users[index].apellido,
                users[index].email, users[index].password, users[index].rol,
                users[index].comercioId, users[index].estado
            );
            userObj.desactiva();
            users[index] = userObj;
            fs.writeFileSync(jsonPath, JSON.stringify(users, null, 2));
            res.redirect('/api/user');
        } else {
            res.status(404).send('Error al desactivar');
        }
    },

    activate: (req, res) => {
        let users = JSON.parse(fs.readFileSync(jsonPath, 'utf-8') || '[]');
        const index = users.findIndex(u => u.id == req.params.id);
        if (index !== -1) {
            const userObj = new Usuario(
                users[index].id, users[index].nombre, users[index].apellido,
                users[index].email, users[index].password, users[index].rol,
                users[index].comercioId, users[index].estado
            );
            userObj.activa();
            users[index] = userObj;
            fs.writeFileSync(jsonPath, JSON.stringify(users, null, 2));
            res.redirect('/api/user');
        } else {
            res.status(404).send('Error al activar');
        }
    }
};

module.exports = userController;
