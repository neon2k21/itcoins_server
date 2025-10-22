const Router = require('express');
const router = new Router();
const timesheetController = require('../controller/timesheet.controller');

router.post('/createTimeSlot', timesheetController.createTimeSlot);
router.get('/getAllTimeSlots', timesheetController.getAllTimeSlots);
router.get('/getTimeSlotById/:id', timesheetController.getTimeSlotById);
router.put('/updateTimeSlot/:id', timesheetController.updateTimeSlot);
router.delete('/deleteTimeSlot/:id', timesheetController.deleteTimeSlot);

module.exports = router;