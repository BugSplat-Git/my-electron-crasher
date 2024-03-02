const { ipcRenderer: ipc } = require("electron")

window.onload = function () {
    // Trigger an unhandled JavaScript error to test BugSplat in main.js
    document.getElementById("submit").onclick = function () {
        const email = document.getElementById("email").innerText;
        const description = document.getElementById("description").innerText;
        ipc.send("report", { email, description });
    }
}