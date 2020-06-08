const Cadet = require("./model");
const Schedule = require("../schedule/model");
const postNewMobile = async (req, res) => {
  const { mobile_key, group } = req.body;

  console.log(mobile_key,'MOB BODY')
  console.log(group,'MOB BODY')
  new Cadet({ mobile_key, group }).save();
  return res.status(200).send("ok");
};

const postMobileLessons = async (req, res) => {
  const { mobile_key } = req.body;
  const group = await Cadet.findOne({ mobile_key }).select({ _id: 0, group: 1 });
  const schedule = await Schedule.find(group).select({
    _id: 0,
    subject: 1,
    lesson_type: 2,
    teacher1: 3,
    teacher2: 4,
    teacher1_1: 5,
    teacher2_1: 6,
    couple: 7,
    date: 8,
    school_week: 9,
    classroom1:10,
    classroom2:11,
    cafedra:12,
    group:13

  });

  console.log(schedule);
  

  res.status(200).send(schedule);
};
const editCadet =async (req,res)=>{
  const {
    mobile_key,
    group

  }=req.body

  await Cadet.findOneAndUpdate({mobile_key},{
    $set:{
      group:group
    }
  });

  res.status(200).json(true);



}

module.exports = {
  postNewMobile,
  postMobileLessons,
  editCadet
};
