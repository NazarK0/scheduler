const Shedule = require("../components/schedule/model");

const addExcelDataToDb = async (data) => {
  data.forEach(async (element) => {
    const lesson = new Shedule(element);
    await lesson.save();
  });
};

module.exports = addExcelDataToDb;