const Shedule= require('../../components/schedule/model');
const Cafedra=require('../../components/cafedra/model');


async function getShedule(kaf,day){
    const cafedra=await Cafedra.findOne().where({
        name:kaf
    })
    const dates = await Shedule.find().select({ _id: 0, date: 1 }).distinct("date");
    let candidate_array=await Shedule.find().where({date:dates[day-1]}).and(
        {
            $or:
            [
                 {classroom1:{$in:cafedra.classrooms}},
                 {classroom2:{$in:cafedra.classrooms}}, 
                
                
              
            ]
           
           

            
        }
       
    ).sort({couple:1})
    
    console.log(candidate_array);
    return candidate_array;






}


module.exports={
    getShedule
}












