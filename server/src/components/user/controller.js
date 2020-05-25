const path = require("path");
const User = require("./model");

module.exports.getList = async (req, res) => {
  const data = await User.find();

  return res.status(200).render(path.join(__dirname, "views", "list"), { data });
};
module.exports.getEdit = async (req, res) => {
  const {id} = req.params;
  const edited = await User.findById(id);
};
module.exports.postEdit = async (req, res) => {};
module.exports.getDelete = async (req, res) => {};
module.exports.postDelete = async (req, res) => {};
module.exports.getAdd = async (req, res) => {};
module.exports.postAdd = async (req, res) => {};
