const { Router } = require('express');
const userController = require('../controllers/user.controller');

const router = Router();

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.put('/:email', userController.updateUser);
router.patch('/:email/activate', userController.activateUser);
router.patch('/:email/deactivate', userController.deactivateUser);
router.delete('/:email', userController.deleteUser);

module.exports = router;
