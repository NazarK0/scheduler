const path = require('path')
const router = require("express").Router();
const multer = require("multer");
const bodyParser = require("body-parser");
const controller = require("./controller");
const authenticationMiddleware = require("../../authentication/middleware");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const upload_path = multer({ dest: path.join(__dirname, "../..", "uploads/temp") });
const excel_schedule = upload_path.single("upload_schedule");



const routeGroup = "schedule";

router.get(`/sp/${routeGroup}/show`, authenticationMiddleware(), controller.getShow);
router.get(`/sp/${routeGroup}/show/:id`, authenticationMiddleware(), controller.getShowByDate);
router
  .route(`/sp/${routeGroup}/upload`)
  .get(authenticationMiddleware(), controller.getUpload)
  .post(authenticationMiddleware(), urlencodedParser, excel_schedule, controller.postUpload);
// router.options(`/${routeGroup}/:kaf/:date`,(req,res)=>{

//  res.set('Access-Control-Allow-Origin', '*');
//  res.set("Access-Control-Allow-Headers", "Content-Type");
//  res.status(200);
// })
router.post(`/${routeGroup}/:kaf/:date_index`,controller.getSheduleForCafedra);
  //router.get(`/cafedra/${routeGroup}/week`, authenticationMiddleware(), controller.getShowWeek);

module.exports = router;
