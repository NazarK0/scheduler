const path = require("path");
const authenticationMiddleware = require("../authentication/middleware");
const mainController = require("../www/controller");

const auth_routes = require("../authentication/routes");
const user_routes = require("../components/user/routes");

//const User = require('../components/user/model')


module.exports = (app) => {


  app.get("/", (req, res) => {
    res.send("Hello world!");
  });
  app.use("/auth", [auth_routes]);
  app.get("/admin",authenticationMiddleware(), mainController.getMainPage);
  app.use("/admin", authenticationMiddleware(), [user_routes]);
  //app.use("/admin", [auth_routes]);
  app.get("/error", (req, res) => {
    res.send("Error");
  });
};
