const path = require("path");
const fs = require("fs");
const Schedule = require("./model");
const getScheduleFromExcel = require("../../API/getScheduleFromExcel");
const addingExcelDataToDb = require("../../API/addingExcelDataToDb");
const convertExcelToJson = require("convert-excel-to-json");
const {getShedule}=require('../../API/SheduleTable.js/getShedule');
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
  const {id} = req.params;
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

module.exports.getSheduleForCafedra= async(req,res)=>{
const {
  kaf,
  date_index

}=req.params;
const result=  await getShedule(kaf,date_index);
res.status(200).json(result);
}
