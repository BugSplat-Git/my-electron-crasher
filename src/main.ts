import { app, BrowserWindow, crashReporter, ipcMain } from "electron";
import { uncaughtException } from "./crasher";
import * as path from "path";

// Required: Handle native crashes in Electron and native add-ins
crashReporter.start({
  companyName: "BugSplat",
  productName: "my-electron-crasher",
  submitURL: "https://fred.bugsplat.com/post/electron/crash.php",
  ignoreSystemCrashHandler: true,
  uploadToServer: true,
  rateLimit: false,
  globalExtra: {
    "key": "en-US",
    "email": "fred@bugsplat.com",
    "comments": "BugSplat rocks!"
  }
})

// Recommended: Initialize BugSplat with database name, app name, and version to catch JavaScript errors
import { BugSplatNode as BugSplat } from "bugsplat-node";
import * as env from "../package.json"
const bugsplat = new BugSplat(env.database, env.name, env.version)

// Recommended: The following methods allow further customization
bugsplat.setDefaultAppKey("main")
bugsplat.setDefaultUser("Fred")
bugsplat.setDefaultEmail("fred@bedrock.com")
bugsplat.setDefaultDescription("description")
bugsplat.setDefaultAdditionalFilePaths(["./src/assets/attachment.txt"])

// Recommended: Post to BugSplat when unhandledRejections and uncaughtExceptions occur
const javaScriptErrorHandler = async (error: Error) => {
  await bugsplat.post(error);
  app.quit();
}
process.on("unhandledRejection", javaScriptErrorHandler)
process.on("uncaughtException", javaScriptErrorHandler)

// Optional: Uncomment to send an Error to BugSplat manually
//bugsplat.post(new Error("foobar!")).then(({ error, response, original }) => console.log(error, response, original))

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../../index.html"));

  // Maximize the window so the buttons aren't hidden
  mainWindow.maximize()

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
    // On macOS it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Called from renderer.js to test JavaScript error handling
ipcMain.on("mainError", function () {
  uncaughtException()
})

// Called from renderer.js to test Native error handling
ipcMain.on("nativeCrash", function () {
  process.crash()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
