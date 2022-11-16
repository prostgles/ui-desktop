"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unhandled = require('electron-unhandled');
unhandled();
const electron_1 = require("electron");
const crypto_1 = require("crypto");
const electronSid = (0, crypto_1.randomUUID)();
const expressApp = require("./ui/server/dist/server/src/electronConfig");
const iconPath = __dirname + '/icon512.png';
/** Limit to single instance */
let mainWindow;
const gotTheLock = electron_1.app.requestSingleInstanceLock();
if (!gotTheLock) {
    console.log("Electron multi instance not allowed. Exiting...");
    electron_1.app.quit();
}
else {
    electron_1.app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized())
                mainWindow.restore();
            mainWindow.focus();
        }
    });
    initApp();
}
function initApp() {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    electron_1.app.whenReady().then(async () => {
        console.error("FIX app.getPath('userData')", electron_1.app.getPath('userData'));
        expressApp.start(electron_1.safeStorage, {
            rootDir: electron_1.app.getPath('userData'),
            port: 0,
            electronSid,
            onSidWasSet: () => {
                console.log("onSidWasSet, reloading...");
                mainWindow?.reload();
            }
        }, (actualPort) => {
            createWindow(actualPort, electronSid);
            new electron_1.Tray(iconPath);
            electron_1.app.on('activate', function () {
                // On macOS it's common to re-create a window in the app when the
                // dock icon is clicked and there are no other windows open.
                if (electron_1.BrowserWindow.getAllWindows().length === 0) {
                    createWindow(actualPort, electronSid);
                }
            });
        })
            .catch((err) => {
            console.error("Failed to start expressApp.start", err);
        });
    });
    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    electron_1.app.on('window-all-closed', function () {
        if (process.platform !== 'darwin')
            electron_1.app.quit();
    });
    function createWindow(port, sid) {
        // Create the browser window.
        const mainWindow = new electron_1.BrowserWindow({
            width: 1000,
            height: 1000,
            icon: iconPath,
        });
        mainWindow.setMenuBarVisibility(false);
        setTimeout(async () => {
            const url = `http://localhost:${port}`;
            await mainWindow.loadURL(url);
            try {
                const ses = mainWindow.webContents.session;
                const cookie = { url, name: 'sid_token', value: sid };
                await ses.clearStorageData({ storages: ["cookies"] });
                await ses.cookies.set(cookie);
                mainWindow.reload();
            }
            catch (error) {
                console.error("Failed to set cookie: ", error);
            }
        }, 1100);
    }
}
//# sourceMappingURL=main.js.map