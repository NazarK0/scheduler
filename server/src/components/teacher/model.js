const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const TeacherSchema=new Schema({
    mobile_key:String,
    surname:String,
    name:String,
    subjects:{
        type:Array,of:String,
    },
    cafedra:String




})
module.exports=mongoose.model('teacher',TeacherSchema);