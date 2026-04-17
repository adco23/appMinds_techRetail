const { Router } = require('express');
const { getUsers } = require('../controllers/user.controller.js');

const router = Router();

router.get('/', getUsers);

module.exports = router;
