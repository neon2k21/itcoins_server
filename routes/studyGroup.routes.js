const Router = require('express');
const router = new Router();
const studyGroupController = require('../controller/studyGroup.controller');

router.post('/createStudyGroup', studyGroupController.createStudyGroup);
router.get('/getAllStudyGroups', studyGroupController.getAllStudyGroups);
router.get('/getStudyGroupById/:id', studyGroupController.getStudyGroupById);
router.get('/getStudyGroupsByProgramId/:program_id', studyGroupController.getStudyGroupsByProgramId);
router.put('/updateStudyGroup/:id', studyGroupController.updateStudyGroup);
router.delete('/deleteStudyGroup/:id', studyGroupController.deleteStudyGroup);

module.exports = router;