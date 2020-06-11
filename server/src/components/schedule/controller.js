const path = require("path");
const fs = require("fs");
const Schedule = require("./model");
const getScheduleFromExcel = require("../../API/getScheduleFromExcel");
const addingExcelDataToDb = require("../../API/addingExcelDataToDb");
const convertExcelToJson = require("convert-excel-to-json");
const { getShedule,anySchedule } = require("../../API/SheduleTable.js/getShedule");
const User = require("../user/model");
const Cafedra = require("../cafedra/model");
const { userTypes } = require("../../global/constants");
const hasAccess = require("../../API/hasAccess");

module.exports.getShow = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const dates = await Schedule.find().select({ _id: 0, date: 1 }).distinct("date");

    const dateTimeFormat = new Intl.DateTimeFormat("uk", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
    const formattedDates = dates.map((date) => dateTimeFormat.format(date));
    const data = await Schedule.find({ date: dates[0] }).sort({ group: "asc", couple: "asc" });

    return res.status(200).render(path.join(__dirname, "views", "spByDayList"), {
      data,
      labels: formattedDates,
      day: 0,
    });
  } else return res.status(200).redirect("/signin");
};
module.exports.getShowByDate = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    const dates = await Schedule.find().select({ _id: 0, date: 1 }).distinct("date");

    const dateTimeFormat = new Intl.DateTimeFormat("uk", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
    const formattedDates = dates.map((date) => dateTimeFormat.format(date));
    const data = await Schedule.find({ date: dates[id] }).sort({ group: "asc", couple: "asc" });

    return res.status(200).render(path.join(__dirname, "views", "spByDayList"), {
      data,
      labels: formattedDates,
      day: id,
    });
  } else return res.status(200).redirect("/signin");
};
module.exports.getSpAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { day } = req.params;
    return res.status(200).render(path.join(__dirname, "views", "spEdit"), { day, mode: "add" });
  } else return res.status(200).redirect("/signin");
};
module.exports.postSpAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { day } = req.params;
    const {
      school_week,
      cafedra,
      group,
      couple,
      classroom1,
      classroom2,
      subject,
      lesson_type,
      teacher1,
      teacher2,
      teacher1_1,
      teacher2_1,
    } = req.body;
    const dates = await Schedule.find().select({ _id: 0, date: 1 }).distinct("date");

    await new Schedule({
      group,
      couple,
      classroom1,
      classroom2,
      subject,
      lesson_type,
      teacher1,
      teacher2,
      teacher1_1,
      teacher2_1,
      date: dates[day],
      cafedra,
      school_week,
    }).save();

    return res.status(200).redirect("../show");
  } else return res.status(200).redirect("/signin");
};
module.exports.getSpEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    const editing = await Schedule.findById(id);
    return res
      .status(200)
      .render(path.join(__dirname, "views", "spEdit"), { data: editing, mode: "edit" });
  } else return res.status(200).redirect("/signin");
};
module.exports.postSpEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    const {
      school_week,
      group,
      couple,
      cafedra,
      classroom1,
      classroom2,
      subject,
      lesson_type,
      teacher1,
      teacher2,
      teacher1_1,
      teacher2_1,
    } = req.body;
    await Schedule.findByIdAndUpdate(id, {
      school_week,
      group,
      couple,
      cafedra,
      classroom1,
      classroom2,
      subject,
      lesson_type,
      teacher1,
      teacher2,
      teacher1_1,
      teacher2_1,
    });
    return res.status(200).redirect("../show");
  } else return res.status(200).redirect("/signin");
};
module.exports.postSpDelete = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    await Schedule.findByIdAndDelete(id);
    return res.status(200).redirect("../show");
  } else return res.status(200).redirect("/signin");
};
module.exports.postUpload = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
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
  } else return res.status(200).redirect("/signin");
};
module.exports.getSheduleForCafedra = async (req, res) => {
 
    const { kaf, day } = req.params;
    const result = await getShedule(kaf, day);
    res.status(200).json(result);
 
};
module.exports.getAnySchedule = async (req,res)=>{
  const {kaf,day}=req.params;
  const result=await anySchedule(kaf,day);
  return res.json(result);
}
module.exports.getShowCafWeek = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
    const cafedra = await User.findById(userId).select({ _id: 0, cafedra: 1 });
    const classrooms = await Cafedra.findOne({ name: cafedra.cafedra }).select({
      _id: 0,
      classrooms: 1,
    });

    const dates = await Schedule.find().select({ _id: 0, date: 1 }).distinct("date");
    const schedule = await Schedule.find()
      .or([
        { classroom1: classrooms.classrooms },
        { classroom2: classrooms.classrooms },
        { cafedra: cafedra.cafedra },
      ])
      .where({ date: dates[0] })
      .select({
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
      })
      .sort({ couple: "asc", group: "asc" });

    const dateTimeFormat = new Intl.DateTimeFormat("uk", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
    const labels = dates.map((date) => dateTimeFormat.format(date));

    return res.status(200).render(path.join(__dirname, "views", "cafByDayList"), {
      data: schedule,
      labels,
      day: 0,
    });
  } else return res.status(200).redirect("/signin");
};
module.exports.getShowCafDay = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
    const { idx } = req.params;
    const cafedra = await User.findById(userId).select({ _id: 0, cafedra: 1 });
    const classrooms = await Cafedra.findOne({ name: cafedra.cafedra }).select({
      _id: 0,
      classrooms: 1,
    });
    const dates = await Schedule.find().select({ _id: 0, date: 1 }).distinct("date");
    const schedule = await Schedule.find()
      .or([
        { classroom1: classrooms.classrooms },
        { classroom2: classrooms.classrooms },
        { cafedra: cafedra.cafedra },
        { teacher1: classrooms.classrooms },
        { teacher2: classrooms.classrooms },
        { teacher1_1: classrooms.classrooms },
        { teacher2_1: classrooms.classrooms },
      ])
      .where({ date: dates[idx] })
      .select({
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
      })
      .sort({ couple: "asc", group: "asc" });

    const dateTimeFormat = new Intl.DateTimeFormat("uk", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
    const labels = dates.map((date) => dateTimeFormat.format(date));

    return res.status(200).render(path.join(__dirname, "views", "cafByDayList"), {
      data: schedule,
      labels,
      day: idx,
    });
  } else return res.status(200).redirect("/signin");
};
module.exports.getCafedraEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
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

    return res
      .status(200)
      .render(path.join(__dirname, "views", "cafEdit"), { data: editing, mode: "edit" });
  } else return res.status(200).redirect("/signin");
};
module.exports.postCafedraEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
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
    return res.redirect("../show");
  } else return res.status(200).redirect("/signin");
};
module.exports.getCafedraAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
    const { day } = req.params;
    return res.status(200).render(path.join(__dirname, "views", "cafEdit"), { mode: "add", day });
  } else return res.status(200).redirect("/signin");
};
module.exports.postCafedraAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
    const { day } = req.params;
    const user = await User.findById(userId).select({ _id: 0, cafedra: 1 });
    const {
      group,
      couple,
      classroom1,
      classroom2,
      subject,
      lesson_type,
      teacher1,
      teacher2,
      teacher1_1,
      teacher2_1,
    } = req.body;
    const dates = await Schedule.find().select({ _id: 0, date: 1 }).distinct("date");
    const schedule = await Schedule.findOne({ date: dates[day] }).select({
      _id: 0,
      school_week: 1,
    });

    await new Schedule({
      group,
      couple,
      classroom1,
      classroom2,
      subject,
      lesson_type,
      teacher1,
      teacher2,
      teacher1_1,
      teacher2_1,
      date: dates[day],
      cafedra: user.cafedra,
      school_week: schedule.school_week,
    }).save();

    return res.status(200).redirect("../show");
  } else return res.status(200).redirect("/signin");
};
module.exports.postCafedraDelete = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
    const { id } = req.params;
    await Schedule.findByIdAndDelete(id);
    return res.status(200).redirect("../show");
  } else return res.status(200).redirect("/signin");
};
module.exports.getClassroom=async(req,res)=>{

  const {
    kaf
  }=req.params;

  let result=await Cafedra.findOne({name:kaf});
   return res.json(result.classrooms);


}
