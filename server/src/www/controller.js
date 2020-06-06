const path = require("path");
const User = require('../components/user/model')
const { userTypes } = require("../global/constants");

module.exports.getMainPage = async (req, res) => {
  const userId = req.session.passport.user;
  const user = await User.findById(userId).select({ _id: 0, category: 1 });
  switch (user.category) {
    case userTypes.SP:
      return res.status(200).render(path.join(__dirname, "..", "global/views/layouts", "mainSp"), {
        title: "Головна",
      });
    case userTypes.CAFEDRA:
      return res
        .status(200)
        .render(path.join(__dirname, "..", "global/views/layouts", "mainCafedra"), {
          title: "Головна",
        });
    default:
      return res.status(200).redirect("/signin");
  }
};
