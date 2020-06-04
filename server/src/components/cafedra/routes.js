const router = require("express").Router();
const controller = require("./controller");
const authenticationMiddleware = require("../../authentication/middleware");

const routeGroup = "cafedra";

router.get(
  `/${routeGroup}/:caf_name/classrooms`,
  authenticationMiddleware(),
  controller.getCafedraClassrooms
);
router.get(`/sp/${routeGroup}/classrooms`, authenticationMiddleware(), controller.getAllClassrooms);
router.get(`/sp/${routeGroup}/classrooms/:id`, authenticationMiddleware(), controller.getAllClassroomsByCafedra);
router.get(`/sp/${routeGroup}/subjects`, authenticationMiddleware(), controller.getAllSubjects);
router.get(`/sp/${routeGroup}/subjects/:id`, authenticationMiddleware(), controller.getAllSubjectsByCafedra);
router.get(`/${routeGroup}/:caf_name/subjects`, authenticationMiddleware(), controller.getSubjects);
router
  .route(`/${routeGroup}/edit/:caf_name`)
  .get(authenticationMiddleware(), controller.getEdit)
  .post(authenticationMiddleware(), controller.postEdit);
router
  .route(`/${routeGroup}/edit/:caf_name/classroom/:idx`)
  .get(authenticationMiddleware(), controller.getEditClassroom)
  .post(authenticationMiddleware(), controller.postEditClassroom);
router.post(`/${routeGroup}/delete/:caf_name`, authenticationMiddleware(), controller.postDelete);
router.post(
  `/${routeGroup}/:caf_name/delete/classroom/:idx`,
  authenticationMiddleware(),
  controller.postDeleteClassroom
);
router
  .route(`/${routeGroup}/:caf_name/add/classroom`)
  .get(authenticationMiddleware(), controller.getAddClassroom)
  .post(authenticationMiddleware(), controller.postAddClassroom);

module.exports = router;
