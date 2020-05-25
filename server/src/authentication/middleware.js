const authenticationMiddleware = () => {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/auth/signin");
  };
};

module.exports = authenticationMiddleware;
