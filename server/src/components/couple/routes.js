const router = require("express").Router();
const controller = require("./controller");
const authenticationMiddleware = require("../../authentication/middleware");

const routeGroup = "couple";

router.get(`/sp/${routeGroup}/show`, authenticationMiddleware(), controller.getSpShow);

router
  .route(`/sp/${routeGroup}/add`)
  .get(authenticationMiddleware(), controller.getSpAdd)
  .post(authenticationMiddleware(), controller.postSpAdd);

router
  .route(`/sp/${routeGroup}/edit/:id`)
  .get(authenticationMiddleware(), controller.getSpEdit)
  .post(authenticationMiddleware(), controller.postSpEdit);

router.post(
  `/sp/${routeGroup}/delete/:id`,
  authenticationMiddleware(),
  controller.postSpDelete
);

module.exports = router;
