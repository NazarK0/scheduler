const path = require("path");
const Cafedra = require("../cafedra/model");
const Schedule = require("../schedule/model");
const Classroom = require("./model");
const { userTypes } = require("../../global/constants");
const hasAccess = require("../../API/hasAccess");

const getSpShow = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const labels = await Cafedra.find({ number: { $ne: null } });

    labels.sort((a, b) => Number(a.number) - Number(b.number));

    return res.status(200).render(path.join(__dirname, "views", "spClassroomList"), { labels });
  } else return res.status(200).redirect("/signin");
};

const getSpShowByCafedra = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    const labels = await Cafedra.find({ number: { $ne: null } });
    const { number } = await Cafedra.findById(id).select({ _id: 0, number: 1 });

    labels.sort((a, b) => Number(a.number) - Number(b.number));

    const classrooms = await Classroom.find({ cafedra: id }).sort({name: "asc"});

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

const postSpDelete = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    await Classroom.findByIdAndDelete(id);

    return res.status(200).redirect("../show");
  } else return res.status(200).redirect("/signin");
};

const getSpFree = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { couple } = req.params;

    const edited = await Classroom.findById(id);

    return res.status(200).render(path.join(__dirname, "views", "editClassroom"), {
      mode: "edit",
      cafedra_id,
      data: edited,
    });
  } else return res.status(200).redirect("/signin");
};

const getSpFreeByCouple = async (req, res) => {
   const userId = req.session.passport.user;
   if (await hasAccess(userId, userTypes.SP)) {
     const { couple } = req.params;

     const edited = await Classroom.findById(id);

     return res.status(200).render(path.join(__dirname, "views", "editClassroom"), {
       mode: "edit",
       cafedra_id,
       data: edited,
     });
   } else return res.status(200).redirect("/signin");
};


const postSpFreeByCouple = async (req, res) => {
  const { couple, date } = req.body;
  let coup = Number(couple);

  try {
    const schedule = await Schedule.find().where({ couple: coup }).where({ date: date }).select({
      _id: 0,
      classroom1: 1,
      classroom2: 2,
    });

    let set_couples_classrooms = new Set();
    schedule.forEach((item) => {
      if (item.classroom1 !== null && item.classroom1 !== undefined) {
        set_couples_classrooms.add(item.classroom1);
      }
      if (item.classroom2 !== null && item.classroom2 !== undefined) {
        set_couples_classrooms.add(item.classroom2);
      }
    });
    const all_rooms_obj = await ClassRoom.find().where({
      name: { $nin: Array.from(set_couples_classrooms) },
    });
    res.status(200).render(path.join(__dirname, "views", "spFreeClassrooms"), {
      data: all_rooms_obj,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}


module.exports = {
  getSpShow,
  getSpShowByCafedra,
  //postSpImportFromSchedule,
  getSpAdd,
  postSpAdd,
  getSpEdit,
  postSpEdit,
  postSpDelete,
  getSpFree,
  getSpFreeByCouple,
  postSpFreeByCouple
};

// function getAddClassRoom(req, res) {
//   const { cafedra } = req.params;
//   try {
//     return res.status(200).render(path.join(__dirname, "views", "editClassroom"), {
//       mode: "add",
//       cafedra,
//     });
//   } catch (error) {
//     res.status(500);
//   }
// }
// async function getEditClassRoom(req, res) {
//   const { id_classroom, cafedra } = req.params;

//   let edit_body = await ClassRoom.findById(id_classroom);

//   try {
//     return res.status(200).render(path.join(__dirname, "views", "editClassroom"), {
//       mode: "edit",
//       data: edit_body,
//       id_classroom,
//       cafedra,
//     });
//   } catch (error) {
//     res.status(500);
//   }
// }

// async function AddClassRoom(req, res) {
//   console.log("in");
//   const { cafedra } = req.params;
//   const { name, seats_place, description } = req.body;
//   try {
//     await new ClassRoom({
//       cafedra,
//       name,
//       seats_place,
//       description,
//     }).save();

//     res.status(200).redirect(".");
//   } catch (error) {
//     res.status(500);
//   }
// }
// async function EditClassroom(req, res) {
//   const { name, seats_place, description } = req.body;
//   try {
//     await ClassRoom.findByIdAndUpdate(req.params.id_classroom, {
//       $set: {
//         cafedra: req.params.cafedra,
//         name,
//         seats_place,
//         description,
//       },
//     });
//     res.status(200).redirect("..");
//   } catch (error) {
//     res.status(500).json(error);
//   }
// }
// async function RemoveClassRoom(req, res) {
//   try {
//     await ClassRoom.findByIdAndRemove(req.params.id_classroom);
//     res.status(200).redirect("..");
//   } catch (error) {
//     res.status(500);
//   }
// }
// 
// async function getClassrooms(req, res) {
//   const { kaf } = req.params;
//   console.log(kaf);
//   try {
//     let all_rooms_for_cafedra = await ClassRoom.find({ cafedra: kaf });
//     console.log("All", all_rooms_for_cafedra);
//     let result = all_rooms_for_cafedra.map((item) => {
//       return item.name;
//     });
//     console.log(result);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// }
// module.exports = {
//   AddClassRoom,
//   EditClassroom,
//   RemoveClassRoom,
//   FreeClassRoom,
//   getAddClassRoom,
//   getEditClassRoom,
//   getFreeClassRoom,
//   getClassrooms,
// };
