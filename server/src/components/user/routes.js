const router = require("express").Router();
const controller = require("./controller");
const authenticationMiddleware = require("../../authentication/middleware");

const routeGroup = "user";

router.get(`/${routeGroup}/list`,authenticationMiddleware(), controller.getList);
router
  .route(`/${routeGroup}/edit`)
  .get(authenticationMiddleware(), controller.getEdit)
  .post(authenticationMiddleware(), controller.postEdit);
router
  .post(`/${routeGroup}/delete/:id`, authenticationMiddleware(), controller.postDelete);
router
  .route(`/${routeGroup}/change-password`)
  .get(authenticationMiddleware(), controller.getChangePassword)
  .post(authenticationMiddleware(), controller.postChangePassword);
router
  .route(`/${routeGroup}/add`)
  .get(authenticationMiddleware(), controller.getAdd)
  .post(authenticationMiddleware(), controller.postAdd);

module.exports = router;
