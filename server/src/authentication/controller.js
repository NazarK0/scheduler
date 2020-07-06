const path = require("path");
const User = require("../components/user/model");
const Cafedra = require("../components/cafedra/model");
const { userTypes } = require('../global/constants')

const view = path.join(__dirname, "views", "auth");
const viewTypes = {
  signIn: "signIn",
  signUp: "signUp",
};
const user_types = Array.from(Object.values(userTypes));

module.exports.getSignIn = async (req, res) => {
  res.render(view, { title: "Вхід", type: viewTypes.signIn });
};
module.exports.postSignIn = async (req, res) => {
  res.redirect("/admin");
};
module.exports.getSignUp = async (req, res) => {
  const cafedras_list = await Cafedra.find().select({ _id: 1, number: 2 }).sort({ number: "asc" });

  cafedras_list.sort((a, b) => {
    if (isFinite(a.number) && isFinite(b.number)) {
      return Number(a.number) - Number(b.number);
    } else {
      return a.number > b.number;
    }
  });
  res.render(view, { title: "Реєстрація", type: viewTypes.signUp, user_types,cafedras_list});
};
module.exports.postSignUp = async (req, res) => {
  const { name, user_type, cafedra, email, password, password2 } = req.body;
  const data = { name, cafedra, email };

  const user = await User.findOne({ "local.email": email });
  const cafedras_list = await Cafedra.find().select({ _id: 1, number: 2 }).sort({ number: "asc" });

   cafedras_list.sort((a, b) => {
     if (isFinite(a.number) && isFinite(b.number)) {
       return Number(a.number) - Number(b.number);
     } else {
       return a.number > b.number;
     }
   });

  if (user) {
    res.status(200).render(view, {
      title: "Реєстрація",
      type: viewTypes.signUp,
      user_types,
      ...data,
      message: "Такий e-mail уже зареєстровано",
      cafedras_list
    });
  } else if (password !== password2) {
    res.status(200).render(view, {
      title: "Реєстрація",
      type: viewTypes.signUp,
      user_types,
      ...data,
      message: "Паролі не співпадають",
      cafedras_list
    });
  } else {
    const userData = {
      name,
      category: user_type,
      cafedra,
      local: { email, password },
    };
    await new User(userData).save();
    res.status(200).redirect("./signin");
  }
};
module.exports.postLogout = async (req, res) => {
  req.logout();
  res.redirect("/signin");
};
