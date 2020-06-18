const controller = require('./controller');
const router=require('express').Router();
router.get('/sp/cafedra/:cafedra/classrooms/add',controller.getAddClassRoom);
router.get('/sp/cafedra/:cafedra/classrooms/edit/:id_classroom',controller.getEditClassRoom);
router.post('/sp/cafedra/:cafedra/classrooms/add',controller.AddClassRoom);
router.post('/sp/cafedra/:cafedra/classrooms/edit/:id_classroom',controller.EditClassroom);
router.post('/sp/cafedra/:cafedra/classrooms/delete/:id_classroom',controller.RemoveClassRoom);
router.post('/sp/classroom/free',controller.FreeClassRoom);
router.get('/sp/classroom/free',controller.getFreeClassRoom);
router.get(`/schedule/:kaf`, controller.getClassrooms);



module.exports=router;