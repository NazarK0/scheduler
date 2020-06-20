const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubjectSchema = new Schema({
  cafedra: {
    type: String,
    default: null,
  },
  abbreviation: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: null,
  }
});
module.exports = mongoose.model("subjects", SubjectSchema);
