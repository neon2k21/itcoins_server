const Router = require('express');
const router = new Router();
const studyProgramController = require('../controller/studyProgram.controller');

router.post('/createStudyProgram', studyProgramController.createStudyProgram);
router.get('/getAllStudyPrograms', studyProgramController.getAllStudyPrograms);
router.get('/getStudyProgramById/:id', studyProgramController.getStudyProgramById);
router.get('/getStudyProgramsByAgeGroup/:age_group_id', studyProgramController.getStudyProgramsByAgeGroup);
router.get('/getStudyProgramsByCube/:cube_id', studyProgramController.getStudyProgramsByCube);
router.put('/updateStudyProgram/:id', studyProgramController.updateStudyProgram);
router.delete('/deleteStudyProgram/:id', studyProgramController.deleteStudyProgram);

module.exports = router;