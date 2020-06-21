const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const coupleSchema = new Schema({
  number: Number,
  timeFrom: String,
  timeTo: String,
  innerBreaks: {
    type: Array,
    of: {
      breakFrom: String,
      breakTo: String,
    },
  },
  cafedras: {
    type: Array,
    of: String,
  },
  description: String
});

module.exports = mongoose.model("couple", coupleSchema);
