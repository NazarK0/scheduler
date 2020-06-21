const path = require("path");
const Cafedra = require("../cafedra/model");
const Schedule = require("../schedule/model");
const Subject = require("./model");
const { userTypes } = require("../../global/constants");
const hasAccess = require("../../API/hasAccess");

const getSpShow = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const labels = await Cafedra.find({ number: { $ne: null } });

    labels.sort((a, b) => Number(a.number) - Number(b.number));

    return res.status(200).render(path.join(__dirname, "views", "spSubjectsList"), { labels });
  } else return res.status(200).redirect("/signin");
};

const getSpShowByCafedra = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    const labels = await Cafedra.find({ number: { $ne: null } });
    const { number } = await Cafedra.findById(id).select({ _id: 0, number: 1 });

    labels.sort((a, b) => Number(a.number) - Number(b.number));

    const subjects = await Subject.find({ cafedra: id }).sort({"abbreviation": "asc"});

    return res.status(200).render(path.join(__dirname, "views", "spSubjectsList"), {
      data: subjects,
      labels,
      cafedra_id: id,
      current_cafedra:number
    });
  } else return res.status(200).redirect("/signin");
};

const postSpImportFromSchedule = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    const { number } = await Cafedra.findById(id).select({ _id: 0, number: 1 });

    const current = await Subject.find({ cafedra: id })
      .select({ _id: 0, name: 1 })
      .distinct("abbreviation");
    const subjects = await Schedule.find({ cafedra: number, subject: { $nin: [null, ...current] } })
      .select({ _id: 0, subject: 1 })
      .distinct("subject");

    subjects.forEach(async (item) => await new Subject({ cafedra: id, abbreviation: item }).save());

    return res.status(200).redirect("./show");
  } else return res.status(200).redirect("/signin");
};

const getSpAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { cafedra_id } = req.params;

    return res
      .status(200)
      .render(path.join(__dirname, "views", "editSubject"), { mode: "add", cafedra_id });
  } else return res.status(200).redirect("/signin");
};

const postSpAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { cafedra_id } = req.params;
    const { abbreviation, title } = req.body;

    await new Subject({ cafedra: cafedra_id, abbreviation, title }).save();

    return res.status(200).redirect("./show");
  } else return res.status(200).redirect("/signin");
};

const getSpEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { cafedra_id, id } = req.params;

    const edited = await Subject.findById(id);

    return res.status(200).render(path.join(__dirname, "views", "editSubject"), {
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
    const { abbreviation, title } = req.body;

    await Subject.findByIdAndUpdate(id, { abbreviation, title });
    return res.status(200).redirect("../show");
  } else return res.status(200).redirect("/signin");
};

const postSpDelete = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    await Subject.findByIdAndDelete(id);

    return res.status(200).redirect("../show");
  } else return res.status(200).redirect("/signin");
};

module.exports = {
  getSpShow,
  getSpShowByCafedra,
  postSpImportFromSchedule,
  getSpAdd,
  postSpAdd,
  getSpEdit,
  postSpEdit,
  postSpDelete,
};
