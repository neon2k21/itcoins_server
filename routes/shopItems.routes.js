const Router = require('express');
const router = new Router();
const shopItemsController = require('../controller/shopItems.controller');

router.post('/createShopItem', shopItemsController.createShopItem);
router.get('/getAllShopItems', shopItemsController.getAllShopItems);
router.get('/getShopItemById/:id', shopItemsController.getShopItemById);
router.get('/getShopItemsByCategory/:category_id', shopItemsController.getShopItemsByCategory);
router.put('/updateShopItem/:id', shopItemsController.updateShopItem);
router.delete('/deleteShopItem/:id', shopItemsController.deleteShopItem);

module.exports = router;