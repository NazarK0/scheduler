const Cafedra=require('../cafedra/model');
const Teacher=require('./model');
const Schedule=require('../schedule/model');
async function getAllSubjects(req,res) {
    const {
        cafedra

    }=req.body
try {
    
  let caf_body=await Cafedra.findOne({name:cafedra});
    res.status(200).json(caf_body.subjects);

    
} catch (error) {

    res.status(500);
    
}
}
async function RegisterTeacher(req,res){
 
    try {
        const {
            surname,
            name,
            subjects,
            cafedra,
            mobile_key
        } = req.body;
        const teacher=new Teacher({
            name,
            surname,
            subjects,
            cafedra,
            mobile_key
        })
       await teacher.save();
        res.status(200).json(true);
        
    } catch (error) {
        res.status(500).json(false);
        
    }

}
async function UpdateTeacher(req,res){
    try {
        const {
            surname,
            name,
            subjects,
            cafedra,
            mobile_key
         }=req.body
        
         let updater_teacher=await Teacher.findOne(mobile_key);
        
         await Teacher.findByIdAndUpdate({_id:updater_teacher.id},{

             surname:(surname!==undefined)?surname:updater_teacher.surname,
             name:(name!==undefined)?name:updater_teacher.name,
             subjects:(subjects!==undefined)?subjects:updater_teacher.subjects,
             cafedra:(cafedra!==undefined)?cafedra:updater_teacher.cafedra
         
            })
         res.status(200).json(true);     
    } catch (error) {
        res.status(500);
        
    }
 
    

}
async function getSchedule(req,res){

    try {
        const  {
            mobile_key
       
         }=req.body
         let requester_teacher=await Teacher.findOne({
             mobile_key
         })
         const{subjects}=requester_teacher;
       
         let result=await Schedule.find().where({
             cafedra:requester_teacher.cafedra})
         .where({
             subject:subjects

         })
         .or(
             
                 [
                     {teacher1:requester_teacher.surname},
                     {teacher1_1:requester_teacher.surname},
                     {teacher2:requester_teacher.surname},
                     {teacher2_1:requester_teacher.surname}
                 ]
             
         ).select({
         id:0,



         });
         res.status(200).json(result);
        
    } catch (error) {
        res.status(500).json(error);
        
    }
 


}



module.exports={
    getAllSubjects,
    RegisterTeacher,
    getSchedule,
    UpdateTeacher
}