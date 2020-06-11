const mongoose = require("mongoose");

const cadetSchema = mongoose.Schema({
  group: String,
  mobile_key: {
    type: String,
    unique: true,
    dropDups: true,
  },
  name:String,
  surname:String,
  local: {
    email: String,
    password: String,
  },
});

module.exports = mongoose.model("cadet", cadetSchema);
