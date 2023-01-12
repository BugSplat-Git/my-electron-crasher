// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
const crasher = require("./dist/src/crasher")
const { ipcRenderer } = require("electron")
const env = require("./package.json")

// // Recommended: Initialize BugSplat with database name, app name, and version to catch JavaScript errors
const { BugSplat } = require("bugsplat")
const bugsplat = new BugSplat(env.database, env.name, env.version)

// Recommended: The following methods allow further customization
bugsplat.setDefaultAppKey("renderer")
bugsplat.setDefaultUser("Fred")
bugsplat.setDefaultEmail("fred@bedrock.com")
bugsplat.setDefaultDescription("description")

// Recommended: Post to BugSplat when the renderer encounters a JavaScript error
window.onerror = async (messageOrEvent, source, lineno, colno, error) => {
    await bugsplat.post(error)

    // Recommended: Quit your application when an uncaughtException occurs
    ipcRenderer.send("rendererCrash")
}

window.onload = function () {
    // Trigger an unhandled JavaScript error to test BugSplat in main.js
    document.getElementById("main-error-button").onclick = function () {
        ipcRenderer.send("trigger:user-main-crash");
    }

    // Trigger an Electron Framework crash to test crashReporter in main.js
    document.getElementById("native-crash-button").onclick = function () {
        ipcRenderer.send("trigger:plugin-main-crash");
    }

    // Trigger an unhandled JavaScript error to test BugSplat in renderer.js
    document.getElementById("renderer-error-button").onclick = function () {
        crasher.uncaughtException("uncaughtException: render process");
    }
}