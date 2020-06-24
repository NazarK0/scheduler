const path = require("path");
const router = require("express").Router();
const multer = require("multer");
const bodyParser = require("body-parser");
const controller = require("./controller");
const authenticationMiddleware = require("../../authentication/middleware");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const upload_path = multer({ dest: path.join(__dirname, "../..", "uploads/temp") });
const excel_schedule = upload_path.single("upload_schedule");

const routeGroup = "schedule";


router
  .route(`/sp/${routeGroup}/find/week`)
  .get(authenticationMiddleware(), controller.getSpFindWeek)
  //.post(authenticationMiddleware(), controller.postSpFindWeek);


router.post(`/sp/${routeGroup}/show`, authenticationMiddleware(), controller.postSpFindWeek);
router.get(`/sp/${routeGroup}/date/:date/show/:id`, authenticationMiddleware(), controller.getShowByDate);
router.post(
  `/sp/${routeGroup}/upload`,
  authenticationMiddleware(),
  urlencodedParser,
  excel_schedule,
  controller.postUpload
);
router
  .route(`/sp/${routeGroup}/date/:date/day/:day/add`)
  .get(authenticationMiddleware(), controller.getSpAdd)
  .post(authenticationMiddleware(), controller.postSpAdd);

router
  .route(`/sp/${routeGroup}/date/:date/day/:day/edit/:id`)
  .get(authenticationMiddleware(), controller.getSpEdit)
  .post(authenticationMiddleware(), controller.postSpEdit);

router.post(`/sp/${routeGroup}/delete/:id`, authenticationMiddleware(), controller.postSpDelete);

router.post(`/${routeGroup}/:kaf/:day`, controller.getSheduleForCafedra);
router.get(`/${routeGroup}/:kaf/:day/any`, controller.getAnySchedule);
router.get(
  `/cafedra/${routeGroup}/show/secret-page`,
  authenticationMiddleware(),
  controller.getShowCafWeek_secret
);
router.get(
  `/cafedra/${routeGroup}/show/:idx/secret-page`,
  authenticationMiddleware(),
  controller.getShowCafDay_secret
);
router.get(`/cafedra/${routeGroup}/show`, authenticationMiddleware(), controller.getShowCafWeek);
router.get(
  `/cafedra/${routeGroup}/show/:idx`,
  authenticationMiddleware(),
  controller.getShowCafDay
);

router
  .route(`/cafedra/${routeGroup}/edit/:id`)
  .get(authenticationMiddleware(), controller.getCafedraEdit)
  .post(authenticationMiddleware(), controller.postCafedraEdit);
router
  .route(`/cafedra/${routeGroup}/:day/add`)
  .get(authenticationMiddleware(), controller.getCafedraAdd)
  .post(authenticationMiddleware(), controller.postCafedraAdd);
router.post(
  `/cafedra/${routeGroup}/delete/:id`,
  authenticationMiddleware(),
  controller.postCafedraDelete
);

module.exports = router;
