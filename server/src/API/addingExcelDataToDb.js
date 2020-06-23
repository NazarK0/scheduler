const Shedule = require("../components/schedule/model");

const addExcelDataToDb = async (data) => {
  //await Shedule.db.dropCollection('schedules');
  for(let i=0;i<data.length;i++){
    // if( typeof data[i].classroom1!=='number' &&  typeof data[i].classroom1!=='undefined'){
    //   if(data[i].classroom1!==null && data[i].classroom1.includes("*")){
    //     if(data[i].classroom1)
    //     data[i].classroom1=data[i].classroom1.substring(0,data[i].classroom1.length-1);
    //   }
     

    // }
    // if(typeof data[i].classroom2!=='number'&&  typeof data[i].classroom1!=='undefined'){
    //   if(data[i].classroom2!==null && data[i].classroom2.includes("*")){
    //     data[i].classroom2=data[i].classroom2.substring(0,data[i].classroom2.length-1);
    //   }

    // }
  
  
    
    const lesson = new Shedule(data[i])
    await lesson.save();
  }
};

module.exports = addExcelDataToDb;