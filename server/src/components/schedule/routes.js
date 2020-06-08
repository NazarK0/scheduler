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

router.post(`/${routeGroup}/:kaf/:day`,controller.getSheduleForCafedra);
router.get(`/${routeGroup}/:kaf`,controller.getClassroom);
  router.get(`/cafedra/${routeGroup}/show`, authenticationMiddleware(), controller.getShowCafWeek);
  router.get(`/cafedra/${routeGroup}/show/:idx`, authenticationMiddleware(), controller.getShowCafDay);
  router
    .route(`/cafedra/${routeGroup}/edit/:id`)
    .get(authenticationMiddleware(), controller.getCafedraEdit)
    .post(authenticationMiddleware(), controller.postCafedraEdit);

module.exports = router;
