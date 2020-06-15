const router=require('express').Router();
controller=require('./controller');

router.post('/sp/classroom/add',controller.AddClassRoom);
router.post('/sp/classroom/edit',controller.EditClassroom);
router.post('/sp/classroom/remove',controller.RemoveClassRoom);
router.post('/sp/classroom/free',controller.FreeClassRoom);

module.exports=router;