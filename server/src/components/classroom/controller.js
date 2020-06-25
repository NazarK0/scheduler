const path = require("path");
const moment = require("moment");
const Cafedra = require("../cafedra/model");
const Schedule = require("../schedule/model");
const Classroom = require("./model");
const Couple = require("../couple/model");
const { userTypes } = require("../../global/constants");
const hasAccess = require("../../API/hasAccess");

const getSpShow = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const labels = await Cafedra.find({ number: { $ne: null } });
    labels.sort((a, b) => Number(a.number) - Number(b.number));

    const imported = await Classroom.find({ cafedra: null }).sort({ name: "asc" });

    return res
      .status(200)
      .render(path.join(__dirname, "views", "spClassroomList"), { labels, imported });
  } else return res.status(200).redirect("/signin");
};

const getSpShowByCafedra = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    const labels = await Cafedra.find({ number: { $ne: null } });
    const { number } = await Cafedra.findById(id).select({ _id: 0, number: 1 });

    labels.sort((a, b) => Number(a.number) - Number(b.number));

    const classrooms = await Classroom.find({ cafedra: id }).sort({ name: "asc" });

    return res.status(200).render(path.join(__dirname, "views", "spClassroomList"), {
      data: classrooms,
      labels,
      cafedra_id: id,
      current_cafedra: number,
    });
  } else return res.status(200).redirect("/signin");
};

// const postSpImportFromSchedule = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.SP)) {
//     const { id } = req.params;
//     const { number } = await Cafedra.findById(id).select({ _id: 0, number: 1 });

//     const current = await Classroom.find({ cafedra: id })
//       .select({ _id: 0, name: 1 })
//       .distinct("name");
//     const classrooms_list = await Schedule.find({
//       $and: [
//         { cafedra: number },
//         {
//           $or: [
//             { classroom1: { $nin: [null, ...current] } },
//             { classroom2: { $nin: [null, ...current] } },
//           ],
//         },
//       ],
//     })
//       .select({ _id: 0, classroom1: 1,classroom2:2 })

//     console.log(current, 'CUR')
//     console.log(classrooms, 'CLASSROOMS')

//     //classrooms.forEach(async (item) => await new Classroom({ cafedra: id, name: item }).save());

//     return res.status(200).redirect("./show");
//   } else return res.status(200).redirect("/signin");
// };

const getSpAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { cafedra_id } = req.params;

    return res
      .status(200)
      .render(path.join(__dirname, "views", "editClassroom"), { mode: "add", cafedra_id });
  } else return res.status(200).redirect("/signin");
};

const postSpAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { cafedra_id } = req.params;
    const { name, seats, description } = req.body;

    await new Classroom({ cafedra: cafedra_id, name, seats, description }).save();

    return res.status(200).redirect("./show");
  } else return res.status(200).redirect("/signin");
};

const getSpEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { cafedra_id, id } = req.params;

    const edited = await Classroom.findById(id);

    return res.status(200).render(path.join(__dirname, "views", "editClassroom"), {
      mode: "edit",
      cafedra_id,
      data: edited,
    });
  } else return res.status(200).redirect("/signin");
};

const postSpEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    const { name, seats, description } = req.body;

    await Classroom.findByIdAndUpdate(id, { name, seats, description });
    return res.status(200).redirect("../show");
  } else return res.status(200).redirect("/signin");
};

const getSpImportEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;

    const edited = await Classroom.findById(id);

    const cafedras_list = await Cafedra.find()
      //.select({ number: 1 })
      .sort({ number: "asc" });

    cafedras_list.sort((a, b) => {
      if (isFinite(a.number) && isFinite(b.number)) {
        return Number(a.number) - Number(b.number);
      } else {
        return a.number > b.number;
      }
    });

    console.log(cafedras_list);

    return res.status(200).render(path.join(__dirname, "views", "editImported"), {
      data: edited,
      cafedras_list,
    });
  } else return res.status(200).redirect("/signin");
};

const postSpImportEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    let { name, seats, description, cafedra } = req.body;
    cafedra = cafedra ? cafedra : null;

    await Classroom.findByIdAndUpdate(id, { name, seats, description, cafedra });
    return res.status(200).redirect("../../show");
  } else return res.status(200).redirect("/signin");
};

const postSpDelete = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    await Classroom.findByIdAndDelete(id);

    return res.status(200).redirect("../show");
  } else return res.status(200).redirect("/signin");
};
const postSpImportDelete = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    await Classroom.findByIdAndDelete(id);

    return res.status(200).redirect("../../show");
  } else return res.status(200).redirect("/signin");
};

const getSpFree = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const couples = await Couple.find()
      .select({ _id: 0, number: 1 })
      .sort({ number: "asc" })
      .distinct("number");

    return res.status(200).render(path.join(__dirname, "views", "spFindFreeClassrooms"), {
      labels: couples,
    });
  } else return res.status(200).redirect("/signin");
};

const postSpFindFree = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { couple, date } = req.body;

    const couples = await Couple.find()
      .select({ _id: 0, number: 1 })
      .sort({ number: "asc" })
      .distinct("number");

    if (date && couple) {
      const busy_array = (
        await Schedule.find({
          couple,
          date: moment(date).toISOString(),
          $or: [{ classroom1: { $ne: null } }, { classroom2: { $ne: null } }],
        }).select({
          _id: 0,
          classroom1: 1,
          classroom2: 2,
        })
      ).reduce((accumulator, item) => {
        const tmp = [];
        if (item.classroom1) tmp.push(item.classroom1);
        if (item.classroom2) tmp.push(item.classroom2);
        return [...accumulator, ...tmp];
      }, []);

      const busy = [...new Set(busy_array)].sort();
      console.log(busy)
      const freeWithCafedraId = await Classroom.find({ _id: { $nin: busy } });
      const free = [];

      for (let i = 0; i < freeWithCafedraId.length; i++) {
        let cafedra_number;
        try {
           cafedra_number = await Cafedra.findById(freeWithCafedraId[i].cafedra)
            .select({
              _id: 0,
              number: 1,
            })
            .distinct("number");
        } catch (err) {
          cafedra_number = "";
        }

        free.push({
          id: freeWithCafedraId[i].id,
          cafedra: freeWithCafedraId[i].cafedra,
          cafedra_number,
          name: freeWithCafedraId[i].name,
          seats: freeWithCafedraId[i].seats,
          description: freeWithCafedraId[i].description,
        });
      }

      return res.status(200).render(path.join(__dirname, "views", "spFreeClassrooms"), {
        labels: couples,
        data: free,
        date: moment(date).format("DD.MM.YYYY"),
        couple,
      });
    } else {
      return res.status(200).render(path.join(__dirname, "views", "spFindFreeClassrooms"), {
        labels: couples,
      });
    }
  } else return res.status(200).redirect("/signin");
};

const postSpEditFree = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { cafedra_id, classroom, couple } = req.params;
    const { date } = req.body;
    return res.status(200).render(path.join(__dirname, "views", "spEditFree"), {
      data: {
        cafedra_id,
        couple,
        classroom,
        date,
      },
    });
  } else return res.status(200).redirect("/signin");
};

const postSpEditedFree = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { cafedra_id, classroom, couple } = req.params;
    const { date, group, subject, lesson_type, teacher1, teacher2, classroom2 } = req.body;
    const school_week = (
      await Schedule.findOne({ date: moment(date, "DD.MM.YYYY").toISOString() })
        .select({ _id: 0, school_week: 1 })
        .distinct("school_week")
    )[0];

    await new Schedule({
      cafedra: cafedra_id,
      subject,
      lesson_type,
      teacher1,
      teacher2,
      couple,
      date: moment(date, "DD.MM.YYYY").toISOString(),
      group,
      classroom1: classroom,
      classroom2,
      school_week,
    }).save();

    return res.status(200).redirect("/admin/sp/classroom/free");
  } else return res.status(200).redirect("/signin");
};

module.exports = {
  getSpShow,
  getSpShowByCafedra,
  //postSpImportFromSchedule,
  getSpAdd,
  postSpAdd,
  getSpEdit,
  postSpEdit,
  getSpImportEdit,
  postSpImportEdit,
  postSpDelete,
  postSpImportDelete,
  getSpFree,
  postSpFindFree,
  postSpEditFree,
  postSpEditedFree,
};
