const path = require("path");
const User = require("./model");

module.exports.getList = async (req, res) => {
  const data = await User.find();

  return res.status(200).render(path.join(__dirname, "views", "list"), { data });
};
module.exports.getEdit = async (req, res) => {
  const id = req.session.passport.user;
  const edited = await User.findById(id);
  if (edited) {
    const {
      name,
      local: { email },
    } = edited;
    return res.status(200).render(path.join(__dirname, "views", "edit"), {
      id,
      name,
      email,
    });
  }
};
module.exports.postEdit = async (req, res) => {};
module.exports.postDelete = async (req, res) => {
  const { id } = req.params;
  const deleted = await User.findByIdAndDelete(id);
  if (deleted) {
    return res.status(200).redirect("..");
  }
};
module.exports.getChangePassword = async (req, res) => {
  return res.status(200).render(path.join(__dirname, "views", "changePassword"));
};
module.exports.postChangePassword = async (req, res) => {
  const id = req.session.passport.user;
  const edited = await User.findById(id);
  const { current_password, new_password1, new_password2 } = req.body;

  if (current_password === edited.local.password) {
    if (new_password1 === new_password2 &&new_password1 !== "") {
      await User.findByIdAndUpdate(id, { "local.password": new_password1 });
      return res.status(200).redirect('../..')
    } else {
      return res.status(200).render(path.join(__dirname, "views", "changePassword"));
    }
  } else {
    return res.status(200).render(path.join(__dirname, "views", "changePassword"));
  }
};
module.exports.getAdd = async (req, res) => {};
module.exports.postAdd = async (req, res) => {};
