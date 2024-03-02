import { CrashPostClient, CrashType } from '@bugsplat/js-api-client';
import { createHash } from "crypto";
import { BrowserWindow, app, crashReporter, ipcMain, shell } from "electron";
import * as JSZip from "jszip";
import { readdir } from "node:fs/promises";
import * as path from "node:path";
import { unhandledRejection } from "./crasher";

const { add } = require('../addon.node');
let crashReportWindow: BrowserWindow;

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
import { createReadStream } from "node:fs";
import * as env from "../package.json";
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
  //mainWindow.webContents.openDevTools();
}

function createCrashReporterWindow() {
  // Create the browser window.
  const crashReporterWindow = new BrowserWindow({
    height: 500,
    width: 420,
    resizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  crashReporterWindow.loadFile(path.join(__dirname, "../../reporter.html"));

  return crashReporterWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();

  if (crashReporter.getLastCrashReport()) {
    crashReportWindow = createCrashReporterWindow();
  }

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

ipcMain.on('open-external-url-event', (event, url) => {
  event.returnValue = 'Message received!'
  shell.openExternal(url);
})

ipcMain.on('report', async (_, args) => {
  crashReportWindow?.close();
  const crashDumpsDirectory = app.getPath("crashDumps");
  const completedDirectory = path.join(crashDumpsDirectory, 'completed');
  const files = await readdir(completedDirectory);
  const name = files.filter(file => file.endsWith('dmp'))[0];
  const crashFilePath = path.join(completedDirectory, name);

  if (name) {
    const client = new CrashPostClient(env.database);
    const jszip = new JSZip().file(name, createReadStream(crashFilePath));
    const file = await jszip.generateAsync({ type: "nodebuffer" });
    const size = file.length;
    const md5 = createHash("md5").update(file).digest("hex");
    const zipFile = {
      name,
      file,
      size
    };
    const result = await client.postCrash(env.name, env.version, CrashType.electron, zipFile, md5);
    const json = await result.json() as unknown as { infoUrl: string };
    const supportResponseWindow = new BrowserWindow({
      height: 600,
      width: 800,
      resizable: true,
    });

    supportResponseWindow.maximize();
    supportResponseWindow.loadURL(json.infoUrl);
  }
});
