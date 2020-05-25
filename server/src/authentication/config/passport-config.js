const passport = require("passport");
const local = require("../strategies/local");
const User = require("../../components/user/model");

module.exports = function () {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(local.name, local.strategy);

  return passport;
};
