const { Router } = require('express');
const { getUsers, createUser } = require('../controllers/user.controller.js');

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);

module.exports = router;
