const Router = require('express');
const router = new Router();
const categoryController = require('../controller/category.controller');

router.post('/createCategory', categoryController.createCategory);
router.get('/getAllCategories', categoryController.getAllCategories);
router.get('/getCategoryById/:id', categoryController.getCategoryById);
router.put('/updateCategory/:id', categoryController.updateCategory);
router.delete('/deleteCategory/:id', categoryController.deleteCategory);

module.exports = router;