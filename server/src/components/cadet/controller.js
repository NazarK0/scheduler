const Cadet = require("./model");
const Schedule = require("../schedule/model");
const postNewMobile = async (req, res) => {
  const { mobile_key, group } = req.body;

  new Cadet({ mobile_key, group }).save();
  return res.status(200).send("ok");
};

const postMobileLessons = async (req, res) => {
  const { mobile_key } = req.body;
  const group = await Cadet.findOne({ mobile_key }).select({ _id: 0, group: 1 });
  const schedule = await Schedule.find( group ).select({
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
  });

  res.status(200).send(schedule);
};

module.exports = {
  postNewMobile,
  postMobileLessons,
};
