const modal = document.getElementById("modal-window");
const buttons = document.getElementsByClassName("open-modal-btn");
const close_btn = document.getElementsByClassName("close");

for (let i = 0; i < buttons.length; i++) {
  buttons[i].onclick = function () {
    modal.style.display = "block";
    console.log(i)
  };
}

for (let i = 0; i < close_btn.length; i++) {
  close_btn[i].onclick = function () {
    modal.style.display = "none";
  };
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
