const path = require("path");
const Cafedra = require("../cafedra/model");
const Schedule = require("../schedule/model");
const ClassRoom = require("../classroom/model");
const User = require("../user/model");
const { userTypes } = require("../../global/constants");
const hasAccess = require("../../API/hasAccess");

const getSpCafedraList = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    let all_caf = await Cafedra.find().sort({ number: "asc" });
    all_caf.sort((a, b) => {
      if (isFinite(a.number) && isFinite(b.number)) {
        return Number(a.number) - Number(b.number);
      } else {
        return a.number > b.number;
      }
    });
    return res.status(200).render(path.join(__dirname, "views", "spList"), { data: all_caf });
  } else return res.status(200).redirect("/signin");
};

const getSpAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    return res.status(200).render(path.join(__dirname, "views", "spEdit"), { mode: "add" });
  } else return res.status(200).redirect("/signin");
};

const postSpAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { number, title } = req.body;
    await new Cafedra({ number, title }).save();
    return res.status(200).redirect("./list");
  } else return res.status(200).redirect("/signin");
};

const getSpEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    const editing = await Cafedra.findById(id);
    return res
      .status(200)
      .render(path.join(__dirname, "views", "spEdit"), { mode: "edit", data: editing });
  } else return res.status(200).redirect("/signin");
};

const postSpEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    const { number, title } = req.body;

    await Cafedra.findByIdAndUpdate(id, { number, title });
    return res.status(200).redirect(".././list");
  } else return res.status(200).redirect("/signin");
};

const postSpDelete = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;

    await Cafedra.findByIdAndDelete(id);
    return res.status(200).redirect(".././list");
  } else return res.status(200).redirect("/signin");
};

const postSpImportFromSchedule = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const current = await Cafedra.find().select({ _id: 0, number: 1 }).distinct("number");
    const list = await Schedule.find({ cafedra: { $nin: [null, ...current] } })
      .select({ _id: 0, cafedra: 1 })
      .distinct("cafedra");
    list.forEach(async (item) => await new Cafedra({ number: item }).save());
    return res.status(200).redirect("./list");
  } else return res.status(200).redirect("/signin");
};

// module.exports.getAllClassrooms = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.SP)) {

//     let all_caf=await Cafedra.find();

//     return res
//       .status(200)
//       .render(path.join(__dirname, "views", "spClassroomsList"), { labels:all_caf });
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.getAllClassroomsByCafedra = async (req, res) => {
//   const {cafedra}=req.params;
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.SP)) {

//     let all_rooms_by_cafedra=await ClassRoom.find().where({
//       cafedra
//     });
//     let all_caf=await Cafedra.find().sort({name:1});

//     return res
//       .status(200)
//       .render(path.join(__dirname, "views", "spClassroomsList"), { data: all_rooms_by_cafedra, labels:all_caf,cafedra});
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.getAllSubjects = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.SP)) {
//     const labels = await Schedule.find({ cafedra: { $ne: null } })
//       .select({ _id: 0, cafedra: 1 })
//       .distinct("cafedra");

//     labels.sort((a, b) => Number(a) - Number(b));

//     const subjects = await Schedule.find({ cafedra: labels[0], subject: { $nin: [null] } })
//       .select({ _id: 0, subject: 1 })
//       .distinct("subject");

//     return res
//       .status(200)
//       .render(path.join(__dirname, "views", "spSubjectsList"), { data: subjects, labels });
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.getAllSubjectsByCafedra = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.SP)) {
//     const { id } = req.params;

//     const labels = await Schedule.find({ cafedra: { $ne: null } })
//       .select({ _id: 0, cafedra: 1 })
//       .distinct("cafedra");

//     labels.sort((a, b) => Number(a) - Number(b));

//     const subjects = await Schedule.find({ cafedra: labels[id], subject: { $nin: [null] } })
//       .select({ _id: 0, subject: 1 })
//       .distinct("subject");

//     return res
//       .status(200)
//       .render(path.join(__dirname, "views", "spSubjectsList"), { data: subjects, labels });
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.getCafedraClassrooms = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.CAFEDRA)) {
//     const user = await User.findById(userId).select({ _id: 0, cafedra: 1 });
//     const cafedra = await Cafedra.findOne({ name: user.cafedra }).select({
//       _id: 0,
//       classrooms: 1,
//     });
//     try {
//       cafedra.classrooms.sort();
//       return res.status(200).render(path.join(__dirname, "views", "cafedraClassroomsList"), {
//         data: cafedra.classrooms,
//       });
//     } catch (err) {
//       return res.status(200).render(path.join(__dirname, "views", "cafedraClassroomsList"));
//     }
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.getCafedraClassrooms_secret = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.CAFEDRA)) {
//     const user = await User.findById(userId).select({ _id: 0, cafedra: 1 });
//     const cafedra = await Cafedra.findOne({ name: user.cafedra }).select({
//       _id: 0,
//       classrooms: 1,
//     });
//     try {
//       cafedra.classrooms.sort();
//       return res.status(200).render(path.join(__dirname, "views", "cafedraClassroomsList_secret"), {
//         data: cafedra.classrooms,
//       });
//     } catch (err) {
//       return res.status(200).render(path.join(__dirname, "views", "cafedraClassroomsList"));
//     }
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.getAddClassroom = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.CAFEDRA)) {
//     return res.status(200).render(path.join(__dirname, "views", "editClassroom"), { mode: "add" });
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.postAddClassroom = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.CAFEDRA)) {
//     const { new_title } = req.body;
//     const user = await User.findById(userId).select({ _id: 0, cafedra: 1 });
//     const cafedra = await Cafedra.findOne({ name: user.cafedra }).select({
//       _id: 0,
//       classrooms: 1,
//     });

//     if (!cafedra) {
//       await new Cafedra({ name: user.cafedra, classrooms: [new_title] }).save();
//       return res.status(200).redirect("../classrooms");
//     }

//     cafedra.classrooms.push(new_title);
//     await Cafedra.findOneAndUpdate({ name: user.cafedra }, { classrooms: cafedra.classrooms });
//     return res.status(200).redirect("../classrooms");
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.getEditClassroom = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.CAFEDRA)) {
//     const { title } = req.params;
//     return res
//       .status(200)
//       .render(path.join(__dirname, "views", "editClassroom"), { mode: "edit", data: title });
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.postEditClassroom = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.CAFEDRA)) {
//     const { title } = req.params;
//     const { new_title } = req.body;
//     const id = req.session.passport.user;
//     const user = await User.findById(id).select({ _id: 0, cafedra: 1 });
//     const cafedra = await Cafedra.findOne({ name: user.cafedra }).select({
//       _id: 0,
//       classrooms: 1,
//     });

//     if (!cafedra) {
//       return res.status(200).redirect("../classrooms");
//     }

//     const editIdx = cafedra.classrooms.findIndex((item) => item === title);
//     if (editIdx >= 0 && editIdx < cafedra.classrooms.length) {
//       cafedra.classrooms = [
//         ...cafedra.classrooms.slice(0, editIdx),
//         new_title,
//         ...cafedra.classrooms.slice(editIdx + 1),
//       ];
//     }
//     await Cafedra.findOneAndUpdate({ name: user.cafedra }, { classrooms: cafedra.classrooms });
//     return res.status(200).redirect("../../classrooms");
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.postDeleteClassroom = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.CAFEDRA)) {
//     const { title } = req.params;
//     const user = await User.findById(userId).select({ _id: 0, cafedra: 1 });
//     const cafedra = await Cafedra.findOne({ name: user.cafedra }).select({
//       _id: 0,
//       classrooms: 1,
//     });

//     if (!cafedra) {
//       return res.status(200).redirect("../classrooms");
//     }

//     const deleteIdx = cafedra.classrooms.findIndex((item) => item === title);
//     if (deleteIdx >= 0 && deleteIdx < cafedra.classrooms.length) {
//       cafedra.classrooms = [
//         ...cafedra.classrooms.slice(0, deleteIdx),
//         ...cafedra.classrooms.slice(deleteIdx + 1),
//       ];
//     }
//     await Cafedra.findOneAndUpdate({ name: user.cafedra }, { classrooms: cafedra.classrooms });
//     return res.status(200).redirect("../../classrooms");
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.getCafedraSubjects = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.CAFEDRA)) {
//     const user = await User.findById(userId).select({ _id: 0, cafedra: 1 });
//     const cafedra = await Cafedra.findOne({ name: user.cafedra }).select({
//       _id: 0,
//       subjects: 1,
//     });

//     try {
//       cafedra.subjects.sort();

//       return res
//         .status(200)
//         .render(path.join(__dirname, "views", "cafedraSubjectsList"), { data: cafedra.subjects });
//     } catch (err) {
//       return res.status(200).render(path.join(__dirname, "views", "cafedraSubjectsList"));
//     }
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.getCafedraSubjects_secret = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.CAFEDRA)) {
//     const user = await User.findById(userId).select({ _id: 0, cafedra: 1 });
//     const cafedra = await Cafedra.findOne({ name: user.cafedra }).select({
//       _id: 0,
//       subjects: 1,
//     });

//     try {
//       cafedra.subjects.sort();

//       return res
//         .status(200)
//         .render(path.join(__dirname, "views", "cafedraSubjectsList"), { data: cafedra.subjects });
//     } catch (err) {
//       return res.status(200).render(path.join(__dirname, "views", "cafedraSubjectsList"));
//     }
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.getAddSubject = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.CAFEDRA)) {
//     return res.status(200).render(path.join(__dirname, "views", "editSubject"), { mode: "add" });
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.postAddSubject = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.CAFEDRA)) {
//     const { new_title } = req.body;
//     const user = await User.findById(userId).select({ _id: 0, cafedra: 1 });
//     const cafedra = await Cafedra.findOne({ name: user.cafedra }).select({
//       _id: 0,
//       subjects: 1,
//     });

//     if (!cafedra) {
//       await new Cafedra({ name: user.cafedra, subjects: [new_title] }).save();
//       return res.status(200).redirect("../subjects");
//     }

//     cafedra.subjects.push(new_title);
//     await Cafedra.findOneAndUpdate({ name: user.cafedra }, { subjects: cafedra.subjects });
//     return res.status(200).redirect("../subjects");
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.getEditSubject = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.CAFEDRA)) {
//     const { title } = req.params;
//     return res
//       .status(200)
//       .render(path.join(__dirname, "views", "editSubject"), { mode: "edit", data: title });
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.postEditSubject = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.CAFEDRA)) {
//     const { title } = req.params;
//     const { new_title } = req.body;
//     const id = req.session.passport.user;
//     const user = await User.findById(id).select({ _id: 0, cafedra: 1 });
//     const cafedra = await Cafedra.findOne({ name: user.cafedra }).select({
//       _id: 0,
//       subjects: 1,
//     });

//     if (!cafedra) {
//       return res.status(200).redirect("../subjects");
//     }

//     const editIdx = cafedra.subjects.findIndex((item) => item === title);
//     if (editIdx >= 0 && editIdx < cafedra.subjects.length) {
//       cafedra.subjects = [
//         ...cafedra.subjects.slice(0, editIdx),
//         new_title,
//         ...cafedra.subjects.slice(editIdx + 1),
//       ];
//     }
//     await Cafedra.findOneAndUpdate({ name: user.cafedra }, { subjects: cafedra.subjects });
//     return res.status(200).redirect("../../subjects");
//   } else return res.status(200).redirect("/signin");
// };
// module.exports.postDeleteSubject = async (req, res) => {
//   const userId = req.session.passport.user;
//   if (await hasAccess(userId, userTypes.CAFEDRA)) {
//     const { title } = req.params;
//     const user = await User.findById(userId).select({ _id: 0, cafedra: 1 });
//     const cafedra = await Cafedra.findOne({ name: user.cafedra }).select({
//       _id: 0,
//       subjects: 1,
//     });

//     if (!cafedra) {
//       return res.status(200).redirect("../subjects");
//     }

//     const deleteIdx = cafedra.subjects.findIndex((item) => item === title);
//     if (deleteIdx >= 0 && deleteIdx < cafedra.subjects.length) {
//       cafedra.subjects = [
//         ...cafedra.subjects.slice(0, deleteIdx),
//         ...cafedra.subjects.slice(deleteIdx + 1),
//       ];
//     }
//     await Cafedra.findOneAndUpdate({ name: user.cafedra }, { subjects: cafedra.subjects });
//     return res.status(200).redirect("../../subjects");
//   } else return res.status(200).redirect("/signin");
// };

module.exports = {
  getSpCafedraList,
  getSpAdd,
  postSpAdd,
  getSpEdit,
  postSpEdit,
  postSpDelete,
  postSpImportFromSchedule,
};
