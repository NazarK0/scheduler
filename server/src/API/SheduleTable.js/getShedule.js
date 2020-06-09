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
    

    return candidate_array;






}
async function anySchedule(kaf,day){

    const cafedra=await Cafedra.findOne({name:kaf});
    const dates = await Shedule.find().select({ _id: 0, date: 1 }).distinct("date");
    

    let any_subbjects=await Shedule.find({
        date:dates[day-1],
    }).or([
        {subject:{$in:cafedra.subjects}},
        {cafedra:!kaf},
        {classroom1:!{$in:cafedra.classrooms}},
        {classroom2:!{$in:cafedra.classrooms}},
    ])
        .sort({
        couple:1
    });
    // where({date:dates[day-1]}).
    // where({subject:{$in:cafedra.subjects}}).
    // where({kaf:!kaf}).
    // where({classroom1:!{$in:cafedra.classrooms}} && {classroom2:!{$in:cafedra.classrooms}});

    return any_subbjects;

}


module.exports={
    getShedule,
    anySchedule
}












