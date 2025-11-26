// 画面切り替え
function showMotorUI() {
  document.getElementById("motor-ui").style.display = "block";
  document.getElementById("camera-ui").style.display = "none";
}

function showCameraUI() {
  document.getElementById("motor-ui").style.display = "none";
  document.getElementById("camera-ui").style.display = "block";
}


// モーター操作（モック）
function motorForward() {
  document.getElementById("motor-status").innerText = "状態：正転中";
  console.log("モータ正転");
}

function motorBackward() {
  document.getElementById("motor-status").innerText = "状態：逆転中";
  console.log("モータ逆転");
}

function motorStop() {
  document.getElementById("motor-status").innerText = "状態：停止";
  console.log("モータ停止");
}
