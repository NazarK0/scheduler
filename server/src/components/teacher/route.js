const router = require("express").Router();
const controller=require('./controllers');


router.post('/teacher/schedule',controller.getSchedule)
router.post('/teacher/register',controller.RegisterTeacher);
router.post('/teacher/update_account',controller.UpdateTeacher);
router.post('/teacher/subjects',controller.getAllSubjects);






module.exports=router;