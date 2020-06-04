const Shedule= require('../../components/schedule/model');


async function getShedule(kaf,index){
    const dates = await Shedule.find().select({ _id: 0, date: 1 }).distinct("date");
    const allShedule=await Shedule.find().where({ cafedra:kaf}).where({date:dates[index-1]}).sort({couple:1});

    return allShedule;






}

module.exports={
    getShedule
}












