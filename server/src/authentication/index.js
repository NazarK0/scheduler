const session = require("express-session");
const sessionOptions = require("./config/session-config");
const configPassport = require("./config/passport-config");

const authentication = (app, mongoose) => {
  const passport = configPassport();

  app.use(session(sessionOptions(mongoose)));
  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports = authentication;
