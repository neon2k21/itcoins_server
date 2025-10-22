const Router = require('express');
const router = new Router();
const statusController = require('../controller/status.controller');

router.post('/createStatus', statusController.createStatus);
router.get('/getAllStatuses', statusController.getAllStatuses);
router.get('/getStatusById/:id', statusController.getStatusById);
router.put('/updateStatus/:id', statusController.updateStatus);
router.delete('/deleteStatus/:id', statusController.deleteStatus);

module.exports = router;