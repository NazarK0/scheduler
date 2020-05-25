const router = require("express").Router();
const controller = require("./controller");
const authenticationMiddleware = require("../../authentication/middleware");

const routeGroup = "user";

router.get(`/${routeGroup}/list`,authenticationMiddleware(), controller.getList);
router
  .route(`${routeGroup}/edit:id`)
  .get(authenticationMiddleware(), controller.getEdit)
  .post(authenticationMiddleware(), controller.postEdit);
router
  .route(`${routeGroup}/delete:id`)
  .get(authenticationMiddleware(), controller.getDelete)
  .post(authenticationMiddleware(), controller.postDelete);
router
  .route(`${routeGroup}/add`)
  .get(authenticationMiddleware(), controller.getAdd)
  .post(authenticationMiddleware(), controller.postAdd);

module.exports = router;
