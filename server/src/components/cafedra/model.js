const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CafedraSchema = new Schema({
  name: {
    type:String,
    unique: true,
    dropDups:true
  },
  subjects:{
    type: Array,
    of: String
  }
});
module.exports = mongoose.model("cafedra", CafedraSchema);
