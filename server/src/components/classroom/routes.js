const router = require("express").Router();
const controller = require("./controller");
const authenticationMiddleware = require("../../authentication/middleware");

const routeGroup = "classroom";

router.get(`/sp/${routeGroup}/show`, authenticationMiddleware(), controller.getSpShow);
router.get(
  `/sp/${routeGroup}/cafedra/:id/show`,
  authenticationMiddleware(),
  controller.getSpShowByCafedra
);
// router.post(
//   `/sp/${routeGroup}/cafedra/:id/import`,
//   authenticationMiddleware(),
//   controller.postSpImportFromSchedule
// );
router
  .route(`/sp/${routeGroup}/cafedra/:cafedra_id/add`)
  .get(authenticationMiddleware(), controller.getSpAdd)
  .post(authenticationMiddleware(), controller.postSpAdd);

router
  .route(`/sp/${routeGroup}/cafedra/:cafedra_id/edit/:id`)
  .get(authenticationMiddleware(), controller.getSpEdit)
  .post(authenticationMiddleware(), controller.postSpEdit);

router.post(
  `/sp/${routeGroup}/cafedra/:cafedra_id/delete/:id`,
  authenticationMiddleware(),
  controller.postSpDelete
);

router.get(`/sp/${routeGroup}/free`, authenticationMiddleware(), controller.getSpFree);
router
  .route(`/sp/${routeGroup}/couple/:couple/free`)
  .get(authenticationMiddleware(), controller.getSpFreeByCouple)
  .post(authenticationMiddleware(), controller.postSpFreeByCouple);


module.exports = router;
