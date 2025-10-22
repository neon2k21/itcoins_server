const Router = require('express');
const router = new Router();
const programCubeController = require('../controller/programCube.controller');

router.post('/createProgramCube', programCubeController.createProgramCube);
router.get('/getAllProgramCubes', programCubeController.getAllProgramCubes);
router.get('/getProgramCubeById/:id', programCubeController.getProgramCubeById);
router.put('/updateProgramCube/:id', programCubeController.updateProgramCube);
router.delete('/deleteProgramCube/:id', programCubeController.deleteProgramCube);

module.exports = router;