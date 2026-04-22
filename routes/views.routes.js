const { Router } = require('express');
const userService = require('../services/user.service.js');

const router = Router();

router.get('/users', (req, res) => {
    const users = userService.getUsers();
    res.render('users/list', { users });
});

router.get('/users/add', (req, res) => {
    res.render('users/add');
});

router.get('/users/edit/:email', (req, res) => {
    const user = userService.findByEmail(req.params.email);
    if (!user) {
        return res.redirect('/users');
    }
    res.render('users/edit', { user });
});

module.exports = router;
