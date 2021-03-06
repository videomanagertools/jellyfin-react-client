/**
 * Electron platform entry point
 */

 const {join, normalize} = require('path');

 const {app, BrowserWindow, protocol} = require('electron');

 const url = require('url');

 const PROTOCOL = 'file';

 const options =
 {
   icon: url.format({
    pathname: 'favicon-228.png',
    protocol: PROTOCOL + ':',
    slashes: true
  }),
   webPreferences: {	   
	   nodeIntegration: true,
	   webSecurity: true,
	   webviewTag: false,
	   navigateOnDragDrop: false
   }
 };


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function onClosed() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow(options);

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: 'index.html',
        protocol: PROTOCOL + ':',
        slashes: true
      }));

    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', onClosed);
}

// Handler of `file://` scheme to load resources inside Electron, based on
// https://github.com/electron/electron/issues/2242#issuecomment-299645388
function handler({url}, callback) {
    // Strip protocol
    let path = url.substr(PROTOCOL.length + 1);

    // Build complete path for node require function
    path = join(__dirname, path);

    // Replace backslashes by forward slashes (windows)
    path = normalize(path);

    callback({path});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
    protocol.interceptFileProtocol(PROTOCOL, handler);

    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
