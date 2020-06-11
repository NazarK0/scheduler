const router = require("express").Router();
const controller=require('./controllers');



router.post('/set_type',controller.postSelectedUserType);





module.exports=router;