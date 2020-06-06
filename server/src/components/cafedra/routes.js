const router = require("express").Router();
const controller = require("./controller");
const authenticationMiddleware = require("../../authentication/middleware");

const routeGroup = "cafedra";

router.get(`/sp/${routeGroup}/classrooms`, authenticationMiddleware(), controller.getAllClassrooms);
router.get(`/sp/${routeGroup}/subjects`, authenticationMiddleware(), controller.getAllSubjects);
router.get(
  `/sp/${routeGroup}/subjects/:id`,
  authenticationMiddleware(),
  controller.getAllSubjectsByCafedra
);
router.get(
  `/${routeGroup}/classrooms`,
  authenticationMiddleware(),
  controller.getCafedraClassrooms
);
router
  .route(`/${routeGroup}/classroom/add`)
  .get(authenticationMiddleware(), controller.getAddClassroom)
  .post(authenticationMiddleware(), controller.postAddClassroom);
router
  .route(`/${routeGroup}/classroom/edit/:title`)
  .get(authenticationMiddleware(), controller.getEditClassroom)
  .post(authenticationMiddleware(), controller.postEditClassroom);
router.post(
  `/${routeGroup}/classroom/delete/:title`,
  authenticationMiddleware(),
  controller.postDeleteClassroom
);
router.get(
  `/${routeGroup}/subjects`,
  authenticationMiddleware(),
  controller.getCafedraSubjects
);
router
  .route(`/${routeGroup}/subject/edit/:id`)
  .get(authenticationMiddleware(), controller.getEditSubject)
  .post(authenticationMiddleware(), controller.postEditSubject);

module.exports = router;
