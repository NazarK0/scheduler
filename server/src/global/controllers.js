const Cafedra=require('../components/cafedra/model');
const Schedule=require('../components/schedule/model');

 

async function postSelectedUserType(req,res) {
    
    const{
        type
    }=req.body

try {
    switch (type){
        case '0':
           let result_array=[];
           const all_couples = await Schedule.find();
           all_couples.forEach(s=>{
            if (!result_array.includes(s.group)){
                  result_array.push(s.group);
            }
           })
           res.status(200).json(result_array);    
        break;
        case '1':
            const all_cafedra=await Cafedra.find().select({
                name:1,
                _id:0
            }).sort({
                name:-1
                
            });
            res.status(200).json(all_cafedra);
        

        break; 
    }
    
  
    
} catch (error) {

    res.status(500);
    
}




}



module.exports={
    postSelectedUserType
}