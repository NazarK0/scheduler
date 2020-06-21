const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const classroomSchema = new Schema({
 
    cafedra:String,
    name:String,
    seats:Number,
    description:String

})
module.exports=mongoose.model('classroom',classroomSchema);