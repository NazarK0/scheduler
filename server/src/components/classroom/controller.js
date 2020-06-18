const Schedule=require('../schedule/model');
const path=require('path');
const ClassRoom=require('./model');
const { join } = require('path');
 function getAddClassRoom(req,res){
    const{cafedra}=req.params;
     try {
          return res.status(200).render(path.join(__dirname, "views", "editClassroom"),{
         mode:'add',
         cafedra
     });

         
     } catch (error) {
            res.status(500);         
     }


    

}  
async function getEditClassRoom(req,res){
    const{id_classroom,cafedra}=req.params;

    let edit_body=await ClassRoom.findById(id_classroom);

    try {
         return res.status(200).render(path.join(__dirname, "views", "editClassroom"),{
            mode:'edit',data:edit_body,id_classroom,cafedra});
        
    } catch (error) {
        res.status(500);
    }

}

async function AddClassRoom(req,res){
    console.log('in');
    const{cafedra}=req.params;
    const{
        name,
        seats_place,
        description

    }=req.body
    try {
       await new ClassRoom({
            cafedra,
            name,
            seats_place,
            description
    
        }).save(); 
    
    
        res.status(200).redirect('.');
        
    } catch (error) {
        res.status(500); 
    }
   




}
async function EditClassroom (req,res){
    const {
        
        name,
        seats_place,
        description
    }=req.body
    try {
        await ClassRoom.findByIdAndUpdate(req.params.id_classroom,{
            $set:{
                cafedra:req.params.cafedra,
                name,
                seats_place,
                description
            }
        })
        res.status(200).redirect('..');
        
    } catch (error) {
        res.status(500).json(error); 
        
    }
}
async function RemoveClassRoom(req,res){

    try {
        await ClassRoom.findByIdAndRemove(req.params.id_classroom);
        res.status(200).redirect('..');
        
    } catch (error) {
        res.status(500);
        
    }


}
async function FreeClassRoom(req,res){
    const {
        couple,
        date
        
    } = req.body;
    let coup=Number(couple);

        try {
        const schedule=await Schedule.find().where({couple:coup}).where({date:date}).select({
            _id:0,
            classroom1:1,
            classroom2:2
        });
     
        let set_couples_classrooms=new Set();
        schedule.forEach(item=>{
            if(item.classroom1!==null && item.classroom1!==undefined){
                set_couples_classrooms.add(item.classroom1);
            }
            if(item.classroom2!==null && item.classroom2!==undefined){
                set_couples_classrooms.add(item.classroom2);
            }
        
        
        })
        const all_rooms_obj=await ClassRoom.find().where({
            name:{ $nin:Array.from(set_couples_classrooms)}
        });
        res.status(200).render(path.join(__dirname,'views','spFreeClassrooms'),{
            data:all_rooms_obj

        });
        
    } catch (error) {
        res.status(500).json(error);
        
    }



}
async function getFreeClassRoom(req,res){
   
    try {
        let dates= await Schedule.find().select({ _id: 0, date: 1 }).distinct("date");
        console.log(dates);
        res.status(200).render(path.join(__dirname, "views", "spFreeClassroomsForm"),{
            dates:dates
        })
        
    } catch (error) {
        res.status(500).json(error);
        
    }

}
async function getClassrooms(req,res){
    const{kaf}=req.params
    console.log(kaf);
    try {
        let all_rooms_for_cafedra=await ClassRoom.find({cafedra:kaf})
        console.log('All',all_rooms_for_cafedra);
        let result=all_rooms_for_cafedra.map(item=>{
            return item.name;
        })
        console.log(result);
        res.status(200).json(result);
    
        
    } catch (error) {
        res.status(500).json(error);
        
    }
   
}
module.exports={
    AddClassRoom,
    EditClassroom,
    RemoveClassRoom,
    FreeClassRoom,
    getAddClassRoom,
    getEditClassRoom,
    getFreeClassRoom,
    getClassrooms
}