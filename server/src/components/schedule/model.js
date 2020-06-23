const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ScheduleSchema = new Schema(
  {
    cafedra: {
      type: String,
      default: null,
    },
    subject: {
      type: String,
      default: null,
    },
    lesson_type: {
      type: String,
      default: null,
    },
    teacher1: {
      type: String,
      default: null,
    },
    teacher1_1: {
      type: String,
      default: null,
    },
    teacher2: {
      type: String,
      default: null,
    },
    teacher2_1: {
      type: String,
      default: null,
    },
    couple: {
      type: Number,
      default: null,
    },
    date: {
      type: String,
      default: null,
    },
    group: {
      type: String,
      default: null,
    },
    school_week: {
      type: Number,
      default: null,
    },
    classroom1:{
      type:String,
      default:null
    },
    classroom2:{
      type:String,
      default:null
    }
  },
 
);
module.exports = mongoose.model("schedule", ScheduleSchema);
