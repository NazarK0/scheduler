const path = require("path");
const User = require("./model");

module.exports.getList = async (req, res) => {
  const data = await User.find();

  return res.status(200).render(path.join(__dirname, "views", "list"), { data });
};
module.exports.getEdit = async (req, res) => {
  const { id } = req.params;
  const edited = await User.findById(id);
  if (edited) {
    const {
      id,
      f_name,
      s_name,
      th_name,
      phone,
      local: { email },
    } = edited;
    return res
      .status(200)
      .render(path.join(__dirname, "views", "edit"), {
        id,
        f_name,
        s_name,
        th_name,
        phone,
        email,
        act: "edit",
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
module.exports.getChangePassword = async (req, res) => {};
module.exports.postChangePassword = async (req, res) => {};
module.exports.getAdd = async (req, res) => {};
module.exports.postAdd = async (req, res) => {};
