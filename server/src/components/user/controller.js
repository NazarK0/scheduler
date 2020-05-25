const path = require("path");
const User = require("./model");

module.exports.getList = async (req, res) => {
  const list = await User.find();

  res.status(200).render(path.join(__dirname, "list", { list }));
};
module.exports.getEdit = async (req, res) => {};
module.exports.postEdit = async (req, res) => {};
module.exports.getDelete = async (req, res) => {};
module.exports.postDelete = async (req, res) => {};
module.exports.getAdd = async (req, res) => {};
module.exports.postAdd = async (req, res) => {};
