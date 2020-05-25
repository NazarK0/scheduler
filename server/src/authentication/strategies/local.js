const LocalStrategy = require("passport-local").Strategy;
const User = require("../../components/user/model");
const strategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    //passReqToCallback: true,
  },
  (email, password, done) => {
    User.findOne({ "local.email": email }).then((user) => {
      console.log(user, "USER");
      if (!user) {
        console.log("no such user");
        return done(null, false);
      }
      if (user.local.password !== password) {
        console.log("wrong pass");
        return done(null, false);
      }

      return done(null, user);
    });
  }
);

module.exports = {
    name: "local",
    strategy
}