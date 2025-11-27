const screens = ["service-screen", "motor-screen", "camera-screen"];

function showSection(targetId) {
  screens.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle("active", id === targetId);
  });
}

function showServiceMenu() {
  showSection("service-screen");
}

function showMotorUI() {
  showSection("motor-screen");
}

function showCameraUI() {
  showSection("camera-screen");
}

// --- モーター操作（モック） ---
function motorForward() {
  document.getElementById("motor-status").innerText = "状態：正転中";
}

function motorBackward() {
  document.getElementById("motor-status").innerText = "状態：逆転中";
}

function motorStop() {
  document.getElementById("motor-status").innerText = "状態：停止";
}
