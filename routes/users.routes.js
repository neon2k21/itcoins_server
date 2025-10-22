const Router = require('express');
const router = new Router();
const userController = require('../controller/users.controller');

router.post('/createUser', userController.createUser);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUserById/:id', userController.getUserById);
router.get('/getUserByEmail/:email', userController.getUserByEmail);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);

module.exports = router;