const submitBtn = document.getElementById("upload_submit")
submitBtn.onclick = checkfile;

function checkfile(sender) {
  const validExts = new Array(".xlsx", ".xls");
  let fileExt = sender.value;
  fileExt = fileExt.substring(fileExt.lastIndexOf("."));
  if (validExts.indexOf(fileExt) < 0) {
    alert("Invalid file selected, valid files are of " + validExts.toString() + " types.");
    return false;
  } else return true;
}
