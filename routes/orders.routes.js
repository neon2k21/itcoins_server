const Router = require('express');
const router = new Router();
const ordersController = require('../controller/orders.controller');

router.post('/createOrder', ordersController.createOrder);
router.get('/getAllOrders', ordersController.getAllOrders);
router.get('/getOrderByUserId/:user_id', ordersController.getOrderByUserId);
router.get('/getOrderById/:id', ordersController.getOrderById);
router.put('/updateOrder/:id', ordersController.updateOrder);
router.delete('/deleteOrder/:id', ordersController.deleteOrder);

module.exports = router;