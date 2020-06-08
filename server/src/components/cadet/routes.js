const router = require("express").Router();
const controller = require("./controller");
const authenticationMiddleware = require("../../authentication/middleware");

const routeGroup = "cadet";

router.post(`/${routeGroup}/mobile`, controller.postNewMobile);
router.post(`/${routeGroup}/mobile/lessons`, controller.postMobileLessons);
router.post(`/${routeGroup}/edit`,controller.editCadet)

module.exports = router;
