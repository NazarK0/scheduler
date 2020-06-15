const Schedule=require('../schedule/model');
const ClassRoom=require('./model');
async function AddClassRoom(req,res){
    const{
        cafedra,
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
    
    
        res.status(200);
        
    } catch (error) {
        res.status(500); 
    }
   




}
async function EditClassroom (req,res){
    const {
        cafedra,
        name,
        seats_place,
        description
    }=req.body

    try {
        await ClassRoom.findByIdAndUpdate({id:req.params.id_classroom},{
            $set:{
                cafedra,
                name,
                seats_place,
                description
            }
        })
        res.status(200)
        
    } catch (error) {
        res.status(500); 
        
    }
}
async function RemoveClassRoom(req,res){

    try {
        await ClassRoom.findByIdAndRemove(req.params.id_classroom);
        res.status(200);
        
    } catch (error) {
        res.status(500);
        
    }


}
async function FreeClassRoom(req,res){
    const {
        couple,
        date
        
    } = req.body;
    try {
        const schedule=await Schedule.find().where(couple).where(date).select({
            id:0,
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
            name:{ $ne:set_couples_classrooms}
        });
        res.status(200);
        
    } catch (error) {
        res.status(500);
        
    }



}
module.exports={
    AddClassRoom,
    EditClassroom,
    RemoveClassRoom,
    FreeClassRoom
}