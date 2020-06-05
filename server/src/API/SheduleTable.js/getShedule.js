const Shedule= require('../../components/schedule/model');


async function getShedule(kaf,index){
    const classrooms=['219','219a','221','223','224','226','230']
    const dates = await Shedule.find().select({ _id: 0, date: 1 }).distinct("date");

   
    classrooms.forEach(async(s)=>{
      
        let other=await Shedule.find().where({cafedra:null}).where({date:dates[index-1]}).and({
            $or:[{classroom1:s},{classroom2:s},{teacher2:s}]
        });
        other.forEach(async s=>{
           await Shedule.findByIdAndUpdate({_id:s.id},{
               $set:{
                   cafedra:'22'
               }
           }) 
        })
       
       
    })
    let allShedule=await Shedule.find().where({ cafedra:kaf}).where({date:dates[index-1]}).sort({couple:1});
    return allShedule






}

module.exports={
    getShedule
}












