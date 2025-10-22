const Router = require('express');
const router = new Router();
const ageGroupController = require('../controller/ageGroup.controller');

router.post('/createAgeGroup', ageGroupController.createAgeGroup);
router.get('/getAllAgeGroups', ageGroupController.getAllAgeGroups);
router.get('/getAgeGroupById/:id', ageGroupController.getAgeGroupById);
router.put('/updateAgeGroup/:id', ageGroupController.updateAgeGroup);
router.delete('/deleteAgeGroup/:id', ageGroupController.deleteAgeGroup);

module.exports = router;