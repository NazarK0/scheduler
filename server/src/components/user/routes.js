const router = require("express").Router();
const controller = require("./controller");

const routeGroup = 'user'

router.get(`${routeGroup}/list`, controller.getList);
router.route(`${routeGroup}/edit:id`).get(controller.getEdit).post(controller.postEdit);
router.route(`${routeGroup}/delete:id`).get(controller.getDelete).post(controller.postDelete);
router.route(`${routeGroup}/add`).get(controller.getAdd).post(controller.postAdd);

module.exports = router;
