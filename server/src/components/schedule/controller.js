const path = require("path");
const fs = require("fs");
const Schedule = require("./model");
const getScheduleFromExcel = require("../../API/getScheduleFromExcel");
const addingExcelDataToDb = require("../../API/addingExcelDataToDb");
const convertExcelToJson = require("convert-excel-to-json");
const { getShedule } = require("../../API/SheduleTable.js/getShedule");
const User = require("../user/model");
module.exports.getShow = async (req, res) => {
  const dates = await Schedule.find().select({ _id: 0, date: 1 }).distinct("date");

  const dateTimeFormat = new Intl.DateTimeFormat("uk", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const formattedDates = dates.map((date) => dateTimeFormat.format(date));

  return res.status(200).render(path.join(__dirname, "views", "spByDayList"), {
    data: await Schedule.find({ date: dates[0] }),
    labels: formattedDates,
  });
};

module.exports.getShowByDate = async (req, res) => {
  const { id } = req.params;
  const dates = await Schedule.find().select({ _id: 0, date: 1 }).distinct("date");

  const dateTimeFormat = new Intl.DateTimeFormat("uk", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const formattedDates = dates.map((date) => dateTimeFormat.format(date));

  return res.status(200).render(path.join(__dirname, "views", "spByDayList"), {
    data: await Schedule.find({ date: dates[id] }),
    labels: formattedDates,
  });
};

module.exports.getUpload = async (req, res) => {
  // return res.status(200)
  //     .render(path.join(__dirname, "views", "edit"))
};

module.exports.postUpload = async (req, res) => {
  const file = await req.file;
  if (file) {
    const ext = path.extname(file.originalname.toLowerCase());
    if (ext === ".xls" || ext === ".xlsx") {
      const filePath = path.join(__dirname, "../../uploads/temp", file.filename);
      const rawData = convertExcelToJson({
        sourceFile: filePath,
        header: {
          rows: 7, // Is the number of rows that will be skipped
        },
      });

      const schedule = getScheduleFromExcel(Object.values(rawData)[0]);
      await addingExcelDataToDb(schedule);
      fs.unlinkSync(filePath);
    }
  }
  return res.status(200).redirect("../..");
};

module.exports.getSheduleForCafedra = async (req, res) => {
  const { kaf, date_index } = req.params;
  const result = await getShedule(kaf, date_index);
  res.status(200).json(result);
};
module.exports.getShowCafWeek = async (req, res) => {
  const id = req.session.passport.user;
  const cafedra = await User.findById(id).select({ _id: 0, cafedra: 1 });
  console.log(cafedra);

  const dates = await Schedule.find().select({ _id: 0, date: 1 }).distinct("date");
  const schedule = await Schedule.find(cafedra).where({ date: dates[0] }).select({
    _id: 1,
    group: 2,
    couple: 3,
    subject: 4,
    lesson_type: 5,
    teacher1: 6,
    teacher2: 7,
    teacher1_1: 8,
    teacher2_1: 9,
    classroom1: 10,
    classroom2: 11,
  });

  const dateTimeFormat = new Intl.DateTimeFormat("uk", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const labels = dates.map((date) => dateTimeFormat.format(date));

  return res.status(200).render(path.join(__dirname, "views", "cafByDayList"), {
    data: schedule,
    labels,
  });
};

module.exports.getShowCafDay = async (req, res) => {
  const { idx } = req.params;
  const id = req.session.passport.user;
  const cafedra = await User.findById(id).select({ _id: 0, cafedra: 1 });
  const dates = await Schedule.find().select({ _id: 0, date: 1 }).distinct("date");
  const schedule = await Schedule.find(cafedra).where({ date: dates[idx] }).select({
    group: 1,
    couple: 2,
    subject: 3,
    lesson_type: 4,
    teacher1: 5,
    teacher2: 6,
    teacher1_1: 7,
    teacher2_1: 8,
    classroom1: 9,
    classroom2: 10,
    _id: 11,
  });

  const test = await Schedule.find({ classroom2: "219а" });
  console.log(test, "TEST");

  const dateTimeFormat = new Intl.DateTimeFormat("uk", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const labels = dates.map((date) => dateTimeFormat.format(date));

  return res.status(200).render(path.join(__dirname, "views", "cafByDayList"), {
    data: schedule,
    labels,
  });
};

module.exports.getCafedraEdit = async (req, res) => {
  const { id } = req.params;
  const editing = await Schedule.findById(id).select({
    _id: 1,
    group: 2,
    couple: 3,
    subject: 4,
    lesson_type: 5,
    teacher1: 6,
    teacher2: 7,
    teacher1_1: 8,
    teacher2_1: 9,
    classroom1: 10,
    classroom2: 11,
  });

  return res.status(200).render(path.join(__dirname, "views", "cafEdit"), { data: editing });
};
module.exports.postCafedraEdit = async (req, res) => {
  const { id } = req.params;
  const {
    group,
    couple,
    subject,
    lesson_type,
    teacher1,
    teacher2,
    teacher1_1,
    teacher2_1,
    classroom1,
    classroom2,
  } = req.body;
  await Schedule.findByIdAndUpdate(id, {
    group,
    couple,
    subject,
    lesson_type,
    teacher1,
    teacher2,
    teacher1_1,
    teacher2_1,
    classroom1,
    classroom2,
  });

  return res.redirect("../../..");
};
