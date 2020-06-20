const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CafedraSchema = new Schema({
  number:String,
  title: String,
});
module.exports = mongoose.model("cafedra", CafedraSchema);
