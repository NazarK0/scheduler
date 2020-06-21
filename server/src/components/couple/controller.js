const path = require("path");
const moment = require("moment");
const Couple = require("./model");
const { userTypes } = require("../../global/constants");
const hasAccess = require("../../API/hasAccess");

const getSpShow = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const couples_tmp = await Couple.find();
    const couples = couples_tmp.map((couple) => {
      return {
        id: couple.id,
        number: couple.number,
        timeFrom: moment(couple.timeFrom).format("HH:mm"),
        timeTo: moment(couple.timeTo).format("HH:mm"),
        cafedras: couple.cafedras.join(','),
        description: couple.description,
        innerBreaks: couple.innerBreaks.map((inner_break) => {
          return {
            breakFrom: moment(inner_break.breakFrom).format("HH:mm"),
            breakTo: moment(inner_break.breakTo).format("HH:mm"),
          };
        }),
      };
    });

    return res.status(200).render(path.join(__dirname, "views", "spCoupleList"), {
      data: couples,
    });
  } else return res.status(200).redirect("/signin");
};

const getSpAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    return res.status(200).render(path.join(__dirname, "views", "editCouple"), {
      mode: "add",
    });
  } else return res.status(200).redirect("/signin");
};

const postSpAdd = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { number, timeFrom, timeTo, breaks, cafedras, description } = req.body;

    const parseFrom = moment(`01.01.2001 ${timeFrom}`).toISOString();
    let parseTo = moment(`01.01.2001 ${timeTo}`).toISOString();

    if (parseTo < parseFrom) {
      parseTo = parseFrom;
    }
    console.log(breaks, "BREAKS");
    let realBreaks = [];
    if (breaks.trim()) {
      const parsedBreaks = breaks
        .trim()
        .split(",")
        .map((item) => {
          const parts = item.trim().split("/");
          return {
            timeFrom: parts[0],
            duration: parts[1],
          };
        })
        .map((item) => {
          const breakFrom = moment(`01.01.2001 ${item.timeFrom}`).toISOString();
          const breakTo = moment(breakFrom).add(item.duration, "minutes").toISOString();

          if (breakTo > breakFrom) {
            return {
              breakFrom,
              breakTo,
            };
          }
        });

      realBreaks = parsedBreaks
        .map((item) => {
          if (item.breakFrom > parseFrom && item.breakTo < parseTo) {
            return item;
          }
        })
        .filter((item) => item != undefined || item != null);
    }

    cafedras_array = cafedras
      .trim()
      .split(",")
      .map((item) => item.trim());

    await new Couple({
      number,
      timeFrom: parseFrom,
      timeTo: parseTo,
      innerBreaks: realBreaks,
      cafedras: cafedras_array,
      description,
    }).save();

    return res.status(200).redirect("./show");
  } else return res.status(200).redirect("/signin");
};

const getSpEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;
    const editing = await Couple.findById(id);
    let display = {};
    // console.log(editing)

    if (editing) {
      display.id = editing._id;
      display.number = editing.number;
      display.timeFrom = moment(editing.timeFrom).format("HH:mm");
      display.timeTo = moment(editing.timeTo).format("HH:mm");
      display.innerBreaks = editing.innerBreaks.reduce((accumulator, inner_break) => {
        const from = moment(inner_break.breakFrom).format("HH:mm");
        const duration = moment(inner_break.breakTo)
          .subtract(moment(inner_break.breakFrom))
          .format("mm");
        return accumulator + `${from}/${duration}`;
      }, "");

      display.cafedras = editing.cafedras[0] === "" ? "" : editing.cafedras.join(",");
      display.description = editing.description;
    }

    return res.status(200).render(path.join(__dirname, "views", "editCouple"), {
      mode: "edit",
      data: display,
    });
  } else return res.status(200).redirect("/signin");
};

const postSpEdit = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
    const { id } = req.params;

    const { number, timeFrom, timeTo, breaks, cafedras, description } = req.body;

    const parseFrom = moment(`01.01.2001 ${timeFrom}`).toISOString();
    let parseTo = moment(`01.01.2001 ${timeTo}`).toISOString();

    if (parseTo < parseFrom) {
      parseTo = parseFrom;
    }
    console.log(breaks, "BREAKS");
    let realBreaks = [];
    if (breaks.trim()) {
      const parsedBreaks = breaks
        .trim()
        .split(",")
        .map((item) => {
          const parts = item.trim().split("/");
          return {
            timeFrom: parts[0],
            duration: parts[1],
          };
        })
        .map((item) => {
          const breakFrom = moment(`01.01.2001 ${item.timeFrom}`).toISOString();
          const breakTo = moment(breakFrom).add(item.duration, "minutes").toISOString();

          if (breakTo > breakFrom) {
            return {
              breakFrom,
              breakTo,
            };
          }
        });

      realBreaks = parsedBreaks
        .map((item) => {
          if (item.breakFrom > parseFrom && item.breakTo < parseTo) {
            return item;
          }
        })
        .filter((item) => item != undefined || item != null);
    }

    cafedras_array = cafedras
      .trim()
      .split(",")
      .map((item) => item.trim());

    await Couple.findByIdAndUpdate(id, {
      number,
      timeFrom: parseFrom,
      timeTo: parseTo,
      innerBreaks: realBreaks,
      cafedras: cafedras_array,
      description,
    });

    return res.status(200).redirect("../show");
  } else return res.status(200).redirect("/signin");
};

const postSpDelete = async (req, res) => {
  const userId = req.session.passport.user;
  if (await hasAccess(userId, userTypes.SP)) {
  } else return res.status(200).redirect("/signin");
};

module.exports = {
  getSpShow,
  getSpAdd,
  postSpAdd,
  getSpEdit,
  postSpEdit,
  postSpDelete,
};
