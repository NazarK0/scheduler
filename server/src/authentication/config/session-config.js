const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const sessonStoreOptions = require("./session-store-config");

const sessionOptions = (db) => {
  return {
    secret: "foo",
    store: new MongoStore(sessonStoreOptions(db)),
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 1000, //1 hour
    },
    resave: false,
    saveUninitialized: false,
  };
};

module.exports =sessionOptions;
