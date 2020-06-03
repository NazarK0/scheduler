const path = require("path");
const User = require("../components/user/model");

const view = path.join(__dirname, "views", "auth");
const viewTypes = {
  signIn: "signIn",
  signUp: "signUp",
};

module.exports.getSignIn = async (req, res) => {
  res.render(view, { title: "Вхід", type: viewTypes.signIn });
};

module.exports.postSignIn = async (req, res) => {
  res.redirect("/admin");
};

module.exports.getSignUp = async (req, res) => {
  res.render(view, { title: "Реєстрація", type: viewTypes.signUp });
};

module.exports.postSignUp = async (req, res) => {
  const { name, user_type, cafedra, group, email, password, password2 } = req.body;
  const data = { name, user_type, cafedra, group, email };

  const user = await User.findOne({ "local.email": email });

  if (user) {
    res.status(200).render(view, {
      title: "Реєстрація",
      type: viewTypes.signUp,
      ...data,
      message: "Такий e-mail уже зареєстровано",
    });
  } else if (password !== password2) {
    res.status(200).render(view, {
      title: "Реєстрація",
      type: viewTypes.signUp,
      ...data,
      message: "Паролі не співпадають",
    });
  } else {
    const userData = {
      name,
      user_type,
      cafedra,
      group,
      local: { email, password },
    };
    await new User(userData).save();
    res.status(200).redirect("./signin");
  }
};

module.exports.postLogout = async (req, res) => {
  req.logout();
  res.redirect("/auth/signin");
};
