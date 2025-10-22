const Router = require('express');
const router = new Router();
const scoresController = require('../controller/scores.controller');

router.post('/createScore', scoresController.createScore);
router.get('/getAllScores', scoresController.getAllScores);
router.get('/getScoresByUserId/:user_id', scoresController.getScoresByUserId);
router.get('/getScoreById/:id', scoresController.getScoreById);
router.put('/updateScore/:id', scoresController.updateScore);
router.delete('/deleteScore/:id', scoresController.deleteScore);

module.exports = router;