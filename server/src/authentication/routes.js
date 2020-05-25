const passport = require("passport");
const router = require("express").Router();
const controller = require("./controller");

const authenticate = passport.authenticate(["local"], {
  session: true,
});

const mustAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).redirect('/auth/signin');
  }
  next();
};

router.route("/signin").get(controller.getSignIn).post(authenticate, controller.postSignIn);
router.route("/signup").get(controller.getSignUp).post(controller.postSignUp);
router.post("/logout", mustAuthenticated, controller.postLogout);

module.exports = router;
