const path = require("path");
const fs = require("fs");
const moment = require("moment");
const Schedule = require("./model");
const getScheduleFromExcel = require("../../API/getScheduleFromExcel");
const addingExcelDataToDb = require("../../API/addingExcelDataToDb");
const convertExcelToJson = require("convert-excel-to-json");
const { getShedule, anySchedule } = require("../../API/SheduleTable.js/getShedule");
const User = require("../user/model");
const Cafedra = require("../cafedra/model");
const Classroom = require("../classroom/model");
const { userTypes } = require("../../global/constants");
const hasAccess = require("../../API/hasAccess");
const { domain } = require("../../../config/config.json");

module.exports.getSpFindWeek = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    return res.status(200).render(path.join(__dirname, "views", "spFindWeek"));
  } else return res.status(200).redirect("/signin");
};

module.exports.postSpFindWeek = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { week } = req.body;
    const mondayDate = moment(week, "YYYY-Wgg").toISOString();

    if (mondayDate && mondayDate != "Invalid date") {
      const schedule = await Schedule.find({ date: mondayDate }).sort({
        group: "asc",
        couple: "asc",
      });

      for (let i = 0; i < schedule.length; i++) {
        schedule[i].cafedra = (
          await Cafedra.findById(schedule[i].cafedra)
            .select({ _id: 0, number: 1 })
            .distinct("number")
        )[0];

        schedule[i].classroom1 = (
          await Classroom.findById(schedule[i].classroom1)
            .select({ _id: 0, name: 1 })
            .distinct("name")
        )[0];

        schedule[i].classroom2 = (
          await Classroom.findById(schedule[i].classroom2)
            .select({ _id: 0, name: 1 })
            .distinct("name")
        )[0];
      }
      const labels = [];

      labels.push(`${moment(mondayDate).format("DD.MM.YYYY")} Пн`);
      labels.push(`${moment(mondayDate).add(1, "days").format("DD.MM.YYYY")} Вт`);
      labels.push(`${moment(mondayDate).add(2, "days").format("DD.MM.YYYY")} Ср`);
      labels.push(`${moment(mondayDate).add(3, "days").format("DD.MM.YYYY")} Чт`);
      labels.push(`${moment(mondayDate).add(4, "days").format("DD.MM.YYYY")} Пт`);
      labels.push(`${moment(mondayDate).add(5, "days").format("DD.MM.YYYY")} Сб`);
      //labels.push(`${moment(mondayDate).add(6, "days").format("DD.MM.YYYY")} Нд`);

      return res.status(200).render(path.join(__dirname, "views", "spByDayList"), {
        data: schedule,
        labels,
        date: moment(mondayDate).format("DD.MM.YYYY"),
        day: 0,
      });
    }

    return res.status(200).render(path.join(__dirname, "views", "spFindWeek"));
  } else return res.status(200).redirect("/signin");
};

module.exports.getShowByDate = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { date, id } = req.params;
    const mondayDate = moment(date, "DD.MM.YYYY");

    if (mondayDate && mondayDate != "Invalid date") {
      const schedule = await Schedule.find({
        date: moment(mondayDate).add(id, "days").toISOString(),
      }).sort({ group: "asc", couple: "asc" });

      for (let i = 0; i < schedule.length; i++) {
        schedule[i].cafedra = (
          await Cafedra.findById(schedule[i].cafedra)
            .select({ _id: 0, number: 1 })
            .distinct("number")
        )[0];

        schedule[i].classroom1 = (
          await Classroom.findById(schedule[i].classroom1)
            .select({ _id: 0, name: 1 })
            .distinct("name")
        )[0];

        schedule[i].classroom2 = (
          await Classroom.findById(schedule[i].classroom2)
            .select({ _id: 0, name: 1 })
            .distinct("name")
        )[0];
      }
      const labels = [];

      labels.push(`${moment(mondayDate).format("DD.MM.YYYY")} Пн`);
      labels.push(`${moment(mondayDate).add(1, "days").format("DD.MM.YYYY")} Вт`);
      labels.push(`${moment(mondayDate).add(2, "days").format("DD.MM.YYYY")} Ср`);
      labels.push(`${moment(mondayDate).add(3, "days").format("DD.MM.YYYY")} Чт`);
      labels.push(`${moment(mondayDate).add(4, "days").format("DD.MM.YYYY")} Пт`);
      labels.push(`${moment(mondayDate).add(5, "days").format("DD.MM.YYYY")} Сб`);
      //labels.push(`${moment(mondayDate).add(6, "days").format("DD.MM.YYYY")} Нд`);

      return res.status(200).render(path.join(__dirname, "views", "spByDayList"), {
        data: schedule,
        labels,
        day: id,
        date: moment(mondayDate).format("DD.MM.YYYY"),
      });
    }
    return res.status(200).render(path.join(__dirname, "views", "spFindWeek"));
  } else return res.status(200).redirect("/signin");
};
module.exports.getSpAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { date, day } = req.params;

    const cafedras_list = await Cafedra.find()
      .select({ _id: 1, number: 2 })
      .sort({ number: "asc" });

    cafedras_list.sort((a, b) => {
      if (isFinite(a.number) && isFinite(b.number)) {
        return Number(a.number) - Number(b.number);
      } else {
        return a.number > b.number;
      }
    });

    const classrooms_list = await Classroom.find()
      .select({ _id: 1, name: 2 })
      .sort({ name: "asc" });

    classrooms_list.sort((a, b) => {
      if (isFinite(a.name) && isFinite(b.name)) {
        return Number(a.name) - Number(b.name);
      } else {
        return a.name > b.name;
      }
    });

    return res.status(200).render(path.join(__dirname, "views", "spEdit"), {
      date,
      day,
      cafedras_list,
      classrooms_list,
      mode: "add",
    });
  } else return res.status(200).redirect("/signin");
};
module.exports.postSpAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { date, day } = req.params;

    let {
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

    const data = {
      school_week,
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
    };

    if (classroom1 === "Current" || !classroom1) {
      data.classroom1 = null;
    }

    if (classroom2 === "Current" || !classroom2) {
      data.classroom2 = null;
    }

    if (cafedra !== "Current" || !cafedra) {
      data.cafedra = null;
    }

    await new Schedule({
      ...data,
      date: moment(date, "DD.MM.YYYY").add(day, "days").toISOString(),
    }).save();

    return res.status(200).redirect(`../../show/${day}`);
  } else return res.status(200).redirect("/signin");
};
module.exports.getSpEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id, date, day } = req.params;
    const editing = await Schedule.findById(id);

    editing.cafedra = (
      await Cafedra.findById(editing.cafedra).select({ _id: 0, number: 1 }).distinct("number")
    )[0];

    if (!editing.cafedra) {
      editing.cafedra = "";
    }

    editing.classroom1 = (
      await Classroom.findById(editing.classroom1).select({ _id: 0, name: 1 }).distinct("name")
    )[0];

    editing.classroom2 = (
      await Classroom.findById(editing.classroom2).select({ _id: 0, name: 1 }).distinct("name")
    )[0];

    if (!editing.classroom1) {
      editing.classroom1 = "";
    }
    if (!editing.classroom2) {
      editing.classroom2 = "";
    }

    const cafedras_list = await Cafedra.find()
      .select({ _id: 1, number: 2 })
      .sort({ number: "asc" });

    cafedras_list.sort((a, b) => {
      if (isFinite(a.number) && isFinite(b.number)) {
        return Number(a.number) - Number(b.number);
      } else {
        return a.number > b.number;
      }
    });

    const classrooms_list = await Classroom.find()
      .select({ _id: 1, name: 2 })
      .sort({ name: "asc" });

    classrooms_list.sort((a, b) => {
      if (isFinite(a.name) && isFinite(b.name)) {
        return Number(a.name) - Number(b.name);
      } else {
        return a.name > b.name;
      }
    });
    return res.status(200).render(path.join(__dirname, "views", "spEdit"), {
      data: editing,
      mode: "edit",
      date,
      day,
      cafedras_list,
      classrooms_list,
    });
  } else return res.status(200).redirect("/signin");
};
module.exports.postSpEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id, day } = req.params;
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

    const update_data = {
      school_week,
      group,
      couple,
      subject,
      lesson_type,
      teacher1,
      teacher2,
      teacher1_1,
      teacher2_1,
    };

    if (classroom1 !== "Current") {
      update_data.classroom1 = classroom1 ? classroom1: null;
    }

    if (classroom2 !== "Current") {
      update_data.classroom2 = classroom2 ? classroom2 : null;
    }

    if (cafedra !== "Current") {
      update_data.cafedra = cafedra ? cafedra : null;
    }

    await Schedule.findByIdAndUpdate(id, update_data);
    return res.status(200).redirect(`../../../show/${day}`);
  } else return res.status(200).redirect("/signin");
};
module.exports.postSpDelete = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;

    const deleted = await Schedule.findByIdAndDelete(id).select({ _id: 0, date: 1 });

    const dayOfWeek = moment(deleted.date).format("d") - 1;
    const monday = moment(deleted.date).subtract(dayOfWeek, "days").format("DD.MM.YYYY");

    return res.status(200).redirect(`../date/${monday}/show/${dayOfWeek}`);
  } else return res.status(200).redirect("/signin");
};
module.exports.postSpDrop = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    await Schedule.remove({});
    return res.status(200).redirect("../..");
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

        const schedule = await getScheduleFromExcel(Object.values(rawData)[0]);
        await addingExcelDataToDb(schedule);
        fs.unlinkSync(filePath);
      }
    }
    return res.status(200).redirect("../..");
  } else return res.status(200).redirect("/signin");
};
module.exports.getSheduleForCafedra = async (req, res) => {
  const { kaf, day } = req.params;
  console.log(kaf, day);
  const result = await getShedule(kaf, day);
  res.status(200).json(result);
};
module.exports.getAnySchedule = async (req, res) => {
  const { kaf, day } = req.params;
  const result = await anySchedule(kaf, day);
  return res.json(result);
};
module.exports.getCafedraFindWeek = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
    return res.status(200).render(path.join(__dirname, "views", "cafFindWeek"));
  } else return res.status(200).redirect("/signin");
};
module.exports.postCafedraFindWeek = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
    const { week } = req.body;
    const mondayDate = moment(week, "YYYY-Wgg").toISOString();
    const { cafedra } = await User.findById(userId).select({ _id: 0, cafedra: 1 });
    console.log(mondayDate);

    if (mondayDate && mondayDate != "Invalid date") {
      const schedule = await Schedule.find({ date: mondayDate, cafedra }).sort({
        couple: "asc",
        group: "asc",
      });

      for (let i = 0; i < schedule.length; i++) {
        schedule[i].cafedra = cafedra.number;

        schedule[i].classroom1 = (
          await Classroom.findById(schedule[i].classroom1)
            .select({ _id: 0, name: 1 })
            .distinct("name")
        )[0];

        schedule[i].classroom2 = (
          await Classroom.findById(schedule[i].classroom2)
            .select({ _id: 0, name: 1 })
            .distinct("name")
        )[0];
      }
      const labels = [];

      labels.push(`${moment(mondayDate).format("DD.MM.YYYY")} Пн`);
      labels.push(`${moment(mondayDate).add(1, "days").format("DD.MM.YYYY")} Вт`);
      labels.push(`${moment(mondayDate).add(2, "days").format("DD.MM.YYYY")} Ср`);
      labels.push(`${moment(mondayDate).add(3, "days").format("DD.MM.YYYY")} Чт`);
      labels.push(`${moment(mondayDate).add(4, "days").format("DD.MM.YYYY")} Пт`);
      labels.push(`${moment(mondayDate).add(5, "days").format("DD.MM.YYYY")} Сб`);
      //labels.push(`${moment(mondayDate).add(6, "days").format("DD.MM.YYYY")} Нд`);

      //console.log(cafedra)

      return res.status(200).render(path.join(__dirname, "views", "cafByDayList"), {
        data: schedule,
        labels,
        date: moment(mondayDate).format("DD.MM.YYYY"),
        day: 0,
      });
    }

    return res.status(200).render(path.join(__dirname, "views", "spFindWeek"));
  } else return res.status(200).redirect("/signin");
};
module.exports.getCafShowByDate = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
    const { date, id } = req.params;
    const mondayDate = moment(date, "DD.MM.YYYY");

    if (mondayDate && mondayDate != "Invalid date") {
      const { cafedra } = await User.findById(userId).select({ _id: 0, cafedra: 1 });
      const schedule = await Schedule.find({
        date: moment(mondayDate).add(id, "days").toISOString(),
        cafedra,
      }).sort({ couple: "asc", group: "asc" });

      const { number } = await Cafedra.findById(cafedra).select({ _id: 0, number: 1 });

      for (let i = 0; i < schedule.length; i++) {
        schedule[i].cafedra = number;

        schedule[i].classroom1 = (
          await Classroom.findById(schedule[i].classroom1)
            .select({ _id: 0, name: 1 })
            .distinct("name")
        )[0];

        schedule[i].classroom2 = (
          await Classroom.findById(schedule[i].classroom2)
            .select({ _id: 0, name: 1 })
            .distinct("name")
        )[0];
      }
      const labels = [];

      labels.push(`${moment(mondayDate).format("DD.MM.YYYY")} Пн`);
      labels.push(`${moment(mondayDate).add(1, "days").format("DD.MM.YYYY")} Вт`);
      labels.push(`${moment(mondayDate).add(2, "days").format("DD.MM.YYYY")} Ср`);
      labels.push(`${moment(mondayDate).add(3, "days").format("DD.MM.YYYY")} Чт`);
      labels.push(`${moment(mondayDate).add(4, "days").format("DD.MM.YYYY")} Пт`);
      labels.push(`${moment(mondayDate).add(5, "days").format("DD.MM.YYYY")} Сб`);
      //labels.push(`${moment(mondayDate).add(6, "days").format("DD.MM.YYYY")} Нд`);

      return res.status(200).render(path.join(__dirname, "views", "cafByDayList"), {
        data: schedule,
        labels,
        day: id,
        date: moment(mondayDate).format("DD.MM.YYYY"),
      });
    }
    return res.status(200).render(path.join(__dirname, "views", "spFindWeek"));
  } else return res.status(200).redirect("/signin");
};
module.exports.getCafShowByDate_secret = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
    const { date, id } = req.params;
    const mondayDate = moment(date, "DD.MM.YYYY");

    if (mondayDate && mondayDate != "Invalid date") {
      const { cafedra } = await User.findById(userId).select({ _id: 0, cafedra: 1 });
      const schedule = await Schedule.find({
        date: moment(mondayDate).add(id, "days").toISOString(),
        cafedra,
      }).sort({ couple: "asc", group: "asc" });

      const { number } = await Cafedra.findById(cafedra).select({ _id: 0, number: 1 });

      for (let i = 0; i < schedule.length; i++) {
        schedule[i].cafedra = number;

        schedule[i].classroom1 = (
          await Classroom.findById(schedule[i].classroom1)
            .select({ _id: 0, name: 1 })
            .distinct("name")
        )[0];

        schedule[i].classroom2 = (
          await Classroom.findById(schedule[i].classroom2)
            .select({ _id: 0, name: 1 })
            .distinct("name")
        )[0];
      }
      const labels = [];

      labels.push(`${moment(mondayDate).format("DD.MM.YYYY")} Пн`);
      labels.push(`${moment(mondayDate).add(1, "days").format("DD.MM.YYYY")} Вт`);
      labels.push(`${moment(mondayDate).add(2, "days").format("DD.MM.YYYY")} Ср`);
      labels.push(`${moment(mondayDate).add(3, "days").format("DD.MM.YYYY")} Чт`);
      labels.push(`${moment(mondayDate).add(4, "days").format("DD.MM.YYYY")} Пт`);
      labels.push(`${moment(mondayDate).add(5, "days").format("DD.MM.YYYY")} Сб`);
      //labels.push(`${moment(mondayDate).add(6, "days").format("DD.MM.YYYY")} Нд`);

      return res.status(200).render(path.join(__dirname, "views", "cafByDayList_secret"), {
        data: schedule,
        labels,
        day: id,
        date: moment(mondayDate).format("DD.MM.YYYY"),
      });
    }
    return res.status(200).render(path.join(__dirname, "views", "spFindWeek"));
  } else return res.status(200).redirect("/signin");
};
module.exports.getCafedraEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
    const { date, day, id } = req.params;
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

    editing.classroom1 = (
      await Classroom.findById(editing.classroom1).select({ _id: 0, name: 1 }).distinct("name")
    )[0];

    editing.classroom2 = (
      await Classroom.findById(editing.classroom2).select({ _id: 0, name: 1 }).distinct("name")
    )[0];

    const classrooms_list = await Classroom.find()
      .select({ _id: 1, name: 2 })
      .sort({ name: "asc" });

    classrooms_list.sort((a, b) => {
      if (isFinite(a.name) && isFinite(b.name)) {
        return Number(a.name) - Number(b.name);
      } else {
        return a.name > b.name;
      }
    });

    return res.status(200).render(path.join(__dirname, "views", "cafEdit"), {
      data: editing,
      mode: "edit",
      date,
      day,
      classrooms_list,
    });
  } else return res.status(200).redirect("/signin");
};
module.exports.postCafedraEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
    const { id, day } = req.params;
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

    const update_data = {
      group,
      couple,
      subject,
      lesson_type,
      teacher1,
      teacher2,
      teacher1_1,
      teacher2_1,
    };

    if (classroom1 !== "Current") {
      update_data.classroom1 = classroom1;
    }

    if (classroom2 !== "Current") {
      update_data.classroom2 = classroom2;
    }

    await Schedule.findByIdAndUpdate(id, update_data);

    return res.redirect(`../../show/${day}/root`);
  } else return res.status(200).redirect("/signin");
};
module.exports.getCafedraAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
    const { date, day } = req.params;

    const classrooms_list = await Classroom.find()
      .select({ _id: 1, name: 2 })
      .sort({ name: "asc" });

    classrooms_list.sort((a, b) => {
      if (isFinite(a.name) && isFinite(b.name)) {
        return Number(a.name) - Number(b.name);
      } else {
        return a.name > b.name;
      }
    });
    return res.status(200).render(path.join(__dirname, "views", "cafEdit"), {
      mode: "add",
      date,
      day,
      classrooms_list,
    });
  } else return res.status(200).redirect("/signin");
};
module.exports.postCafedraAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
    const { day } = req.params;
    const { cafedra } = await User.findById(userId).select({ _id: 0, cafedra: 1 });
    let {
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

    if (classroom1 === "Current" || !classroom1) {
      classroom1 = null;
    }

    if (classroom2 === "Current" || !classroom2) {
      classroom2 = null;
    }
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
      cafedra,
      school_week: schedule.school_week,
    }).save();

    return res.status(200).redirect(`../../show/${day}/root`);
  } else return res.status(200).redirect("/signin");
};
module.exports.postCafedraDelete = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.CAFEDRA)) {
    const { id } = req.params;
    const deleted = await Schedule.findByIdAndDelete(id).select({ _id: 0, date: 1 });
    console.log(deleted);
    return res.status(200).redirect(`../date/${date}/show/${index}`);
  } else return res.status(200).redirect("/signin");
};
module.exports.getClassroom = async (req, res) => {
  const { kaf } = req.params;

  let result = await Cafedra.findOne({ name: kaf });
  return res.json(result.classrooms);
};
