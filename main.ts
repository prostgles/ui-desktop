
const unhandled = require('electron-unhandled');
unhandled();
import { app, BrowserWindow, safeStorage, Tray } from 'electron';
import { make } from "./win-inno-setup";
import { randomUUID } from 'crypto';
const electronSid = randomUUID();

const expressApp = require("./ui/server/dist/server/src/electronConfig");

const iconPath = __dirname + '/icon512.png';

/** Limit to single instance */
let mainWindow: BrowserWindow;
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  console.log("Electron multi instance not allowed. Exiting...")
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
    
  initApp()
}


function initApp(){
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(async () => {
    
    expressApp.start(
      safeStorage, 
      { 
        port: 0, 
        electronSid, 
        onSidWasSet: () => { 
          console.log("onSidWasSet, reloading..."); 
          mainWindow?.reload() 
        } 
      }, 
      (actualPort: number) => {
        
        createWindow(actualPort, electronSid);
        new Tray(iconPath);
      
        app.on('activate', function () {
          // On macOS it's common to re-create a window in the app when the
          // dock icon is clicked and there are no other windows open.
          if (BrowserWindow.getAllWindows().length === 0) {
            createWindow(actualPort, electronSid)
          }
        })
    
      })
      .catch((err: any) => {
        console.error("Failed to start expressApp.start", err)
      });
  
  })
  
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })
  
  
  
  function createWindow (port: number, sid: string) {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      width: 1000,
      height: 1000,
      icon: iconPath,
    });
    mainWindow.setMenuBarVisibility(false);
  
    setTimeout(async () => {
      const url = `http://localhost:${port}`;

      await mainWindow.loadURL(url);

      try {

        const ses = mainWindow.webContents.session
        const cookie = { url, name: 'sid_token', value: sid };
        await ses.clearStorageData({ storages: ["cookies"] });
        await ses.cookies.set(cookie);
        mainWindow.reload();
      } catch(error){
        console.error("Failed to set cookie: ", error)
      }
    }, 1100);
  }

}
