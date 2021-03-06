const router = require("express").Router();
const controller = require("./controller");
const authenticationMiddleware = require("../../authentication/middleware");

const routeGroup = "subject";

router.get(`/sp/${routeGroup}/show`, authenticationMiddleware(), controller.getSpShow);
router.get(
  `/sp/${routeGroup}/cafedra/:id/show`,
  authenticationMiddleware(),
  controller.getSpShowByCafedra
);
router.post(
  `/sp/${routeGroup}/cafedra/:id/import`,
  authenticationMiddleware(),
  controller.postSpImportFromSchedule
);
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

router.get(`/cafedra/${routeGroup}/show`, authenticationMiddleware(), controller.getCafedraShow);
router.get(`/cafedra/${routeGroup}/show/root`, authenticationMiddleware(), controller.getCafedraShow_secret);

router
  .route(`/cafedra/${routeGroup}/add`)
  .get(authenticationMiddleware(), controller.getCafedraAdd)
  .post(authenticationMiddleware(), controller.postCafedraAdd);
router
  .route(`/cafedra/${routeGroup}/edit/:id`)
  .get(authenticationMiddleware(), controller.getCafedraEdit)
  .post(authenticationMiddleware(), controller.postCafedraEdit);

router.post(
  `/cafedra/${routeGroup}/delete/:id`,
  authenticationMiddleware(),
  controller.postCafedraDelete
);


module.exports = router;
