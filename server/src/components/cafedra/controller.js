const path = require("path");
const Cafedra = require("../cafedra/model");
const Schedule = require("../schedule/model");

module.exports.getCafedraClassrooms = async (req, res) => {
  const { caf_name } = req.params;
  const classrooms = await Cafedra.findOne({ name: caf_name }).select({ _id: 0, classrooms: 1 });
  return res.status(200).send(classrooms);
};
module.exports.getAllClassrooms = async (req, res) => {
  const labels = await Cafedra.find({ name: { $ne: null } }).select({ _id: 0, name: 1 });
  //.distinct("name");

  labels.sort((a, b) => Number(a) - Number(b));

  const classrooms = await Cafedra.find({ name: labels[0], classrooms: { $nin: [null] } }).select({
    _id: 0,
    classrooms: 1,
  });
  //.distinct("subject");

  return res
    .status(200)
    .render(path.join(__dirname, "views", "spClassroomsList"), { data: classrooms, labels });
};
module.exports.getAllClassroomsByCafedra = async (req, res) => {
  const { id } = req.params;
  const classrooms = await Cafedra.find({ name: labels[id], classrooms: { $nin: [null] } }).select({
    _id: 0,
    classrooms: 1,
  });
  //.distinct("subject");

  return res
    .status(200)
    .render(path.join(__dirname, "views", "spClassroomsList"), { data: classrooms, labels });
};
module.exports.getAllSubjects = async (req, res) => {
  const labels = await Schedule.find({ cafedra: { $ne: null } })
    .select({ _id: 0, cafedra: 1 })
    .distinct("cafedra");

  labels.sort((a, b) => Number(a) - Number(b));

  const subjects = await Schedule.find({ cafedra: labels[0], subject: { $nin: [null] } })
    .select({ _id: 0, subject: 1 })
    .distinct("subject");

  return res
    .status(200)
    .render(path.join(__dirname, "views", "spSubjectsList"), { data: subjects, labels });
};
module.exports.getAllSubjectsByCafedra = async (req, res) => {
  const { id } = req.params;

  const labels = await Schedule.find({ cafedra: { $ne: null } })
    .select({ _id: 0, cafedra: 1 })
    .distinct("cafedra");

  labels.sort((a, b) => Number(a) - Number(b));

  const subjects = await Schedule.find({ cafedra: labels[id], subject: { $nin: [null] } })
    .select({ _id: 0, subject: 1 })
    .distinct("subject");

  return res
    .status(200)
    .render(path.join(__dirname, "views", "spSubjectsList"), { data: subjects, labels });
};
module.exports.getSubjects = async (req, res) => {
  const { caf_name } = req.params;
  const subjects = await Schedule.find({ cafedra: caf_name }).select({ _id: 0, subject: 1 });
  return res.status(200).render(path.join(__dirname, "views", "subjectsList"), { data: subjects });
};
module.exports.getEdit = async (req, res) => {
  const { caf_name } = req.params;
  const editing = await Cafedra.findOne({ name: caf_name });
  return res.status(200).render();
};
module.exports.postEdit = async (req, res) => {
  const { caf_name } = req.params;
  const update = {};
  const edited = await Cafedra.findOneAndUpdate({ name: caf_name }, update);
  return res.status(200).redirect("..");
};
module.exports.getEditClassroom = async (req, res) => {
  const { caf_name, idx } = req.params;
  const editing = await Cafedra.findOne({ name: caf_name });
  return res.status(200).render();
};
module.exports.postEditClassroom = async (req, res) => {
  const { caf_name, idx } = req.params;
  const editing = await Cafedra.findOne({ name: caf_name });
  const classrooms = [];
  const edited = await Cafedra.findOneAndUpdate({ name: caf_name }, { classrooms });
  return res.status(200).redirect("..");
};
module.exports.postDelete = async (req, res) => {
  const { caf_name } = req.params;
  await Cafedra.findOneAndDelete({ name: caf_name });
  return res.status(200).redirect("..");
};
module.exports.postDeleteClassroom = async (req, res) => {
  const { caf_name, idx } = req.params;
  const editing = await Cafedra.findOne({ name: caf_name });
  const classrooms = [];
  await Cafedra.findOneAndUpdate({ name: caf_name }, { classrooms });
  return res.status(200).redirect("..");
};
module.exports.getAddClassroom = async (req, res) => {
  return res.status(200).render();
};
module.exports.postAddClassroom = async (req, res) => {
  const { caf_name } = req.params;
  const editing = await Cafedra.findOne({ name: caf_name });
  const classrooms = [];
  await Cafedra.findOneAndUpdate({ name: caf_name }, { classrooms });
  return res.status(200).redirect("..");
};
