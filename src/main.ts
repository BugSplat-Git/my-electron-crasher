import { BrowserWindow, app, crashReporter, ipcMain, shell } from "electron";
import * as path from "path";
import { unhandledRejection } from "./crasher";

const { database, name, version } = require("../../package.json");

let add: (a: number, b: number) => number;
try {
  ({ add } = require("../addon.node"));
} catch (e) {
  console.warn("Failed to load addon.node, please run `npm run build:cpp`");
}

// Required: Handle native crashes in Electron and native add-ins
crashReporter.start({
  submitURL: `https://${database}.bugsplat.com/post/electron/v2/crash.php`,
  ignoreSystemCrashHandler: true,
  uploadToServer: true,
  rateLimit: false,
  globalExtra: {
    product: name,
    version: version,
    key: "en-US",
    email: "fred@bugsplat.com",
    comments: "BugSplat rocks!",
  },
});

// Recommended: Initialize BugSplat with database name, app name, and version to catch JavaScript errors
import { BugSplatNode as BugSplat } from "bugsplat-node";
const bugsplat = new BugSplat(database, name, version);

// Recommended: The following methods allow further customization
bugsplat.setDefaultAppKey("main");
bugsplat.setDefaultUser("Fred");
bugsplat.setDefaultEmail("fred@bedrock.com");
bugsplat.setDefaultDescription("description");
bugsplat.setDefaultAdditionalFilePaths(["./src/assets/attachment.txt"]);

// Recommended: Post to BugSplat when unhandledRejections and uncaughtExceptions occur
const javaScriptErrorHandler = async (error: Error) => {
  await bugsplat.post(error);
  app.quit();
};
process.on("unhandledRejection", javaScriptErrorHandler);
process.on("uncaughtException", javaScriptErrorHandler);

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
  mainWindow.maximize();

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

ipcMain.on("trigger:user-main-crash", function () {
  console.log(`on.trigger:user-main-crash`);
  unhandledRejection("unhandledRejection: main process");
});

ipcMain.on("trigger:native-main-crash", function () {
  process.crash();
});

ipcMain.on("trigger:addon-main-crash", function () {
  console.log("add = ", add(7, 3));
});

ipcMain.on("open-external-url-event", (event, url) => {
  event.returnValue = "Message received!";
  shell.openExternal(url);
});
