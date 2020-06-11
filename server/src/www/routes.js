const path = require("path");
const authenticationMiddleware = require("../authentication/middleware");
const mainController = require("../www/controller");

const auth_routes = require("../authentication/routes");
const mobile_routes = require("../components/cadet/routes");
const user_routes = require("../components/user/routes");
const schedule_routes = require("../components/schedule/routes");
const cafedra_routes = require("../components/cafedra/routes");
const teacher_routes=require('../components/teacher/route');
const global=require('../global/routes');
//const User = require('../components/user/model')

module.exports = (app) => {
  app.get("/", (req, res) => {
    return res.status(200).redirect('/signin');
  });
  app.use("/", [auth_routes,mobile_routes,global,teacher_routes]);
  app.use("/admin", [user_routes, schedule_routes, cafedra_routes]);
  app.get("/admin", authenticationMiddleware(), mainController.getMainPage);

  //app.use("/admin", [auth_routes]);
  app.get("/error", (req, res) => {
    res.send("Error");
  });
};
