const path = require("path");
const User = require("./model");
const { userTypes } = require("../../global/constants");

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
      category,
      local: { email },
    } = edited;
    switch (category) {
      case userTypes.SP:
        return res.status(200).render(path.join(__dirname, "views", "editSp"), {
          id,
          name,
          email,
          category,
        });
      case userTypes.CAFEDRA:
        return res.status(200).render(path.join(__dirname, "views", "editCafedra"), {
          id,
          name,
          email,
          category,
        });

      default:
        break;
    }
  }
};
module.exports.postEdit = async (req, res) => {
  const userId = req.session.passport.user;
  const {name,email,password}=req.body;
  const user = await User.findById(userId);
  if(password === user.local.password){
    await User.findByIdAndUpdate(userId,{name,email})
  }
  return res.status(200).redirect("..")
};
module.exports.postDelete = async (req, res) => {
  const { id } = req.params;
  const deleted = await User.findByIdAndDelete(id);
  if (deleted) {
    return res.status(200).redirect("..");
  }
};
module.exports.getChangePassword = async (req, res) => {
  const userId = req.session.passport.user;
  const edited = await User.findById(userId).select({ _id: 0, category: 1 });
  return res
    .status(200)
    .render(path.join(__dirname, "views", "changePassword"), { category: edited.category });
};
module.exports.postChangePassword = async (req, res) => {
  const id = req.session.passport.user;
  const edited = await User.findById(id);
  const { current_password, new_password1, new_password2 } = req.body;
  console.log('change pass')

  if (current_password === edited.local.password) {
    if (new_password1 === new_password2 && new_password1 !== "") {
      await User.findByIdAndUpdate(id, { "local.password": new_password1 });
      return res.status(200).redirect("../..");
    } else {
      return res
        .status(200)
        .render(path.join(__dirname, "views", "changePassword"), { category: edited.category });
    }
  } else {
    return res
      .status(200)
      .render(path.join(__dirname, "views", "changePassword"), { category: edited.category });
  }
};
module.exports.getAdd = async (req, res) => {};
module.exports.postAdd = async (req, res) => {};
