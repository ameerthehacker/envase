const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { IPC_CHANNELS } = require('./src/constants');

app.allowRendererProcessReuse = true;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const debug = require('electron-debug');
    const axios = require('axios').default;
    const uiURL = 'http://localhost:3000';
    // adds helpful debugging capabilities
    debug();
    // keep checking whether the dev server for react is ready or not
    const timer = setInterval(() => {
      axios
        .get(uiURL)
        .then(() => {
          axios.Cancel();
          // UI started
          console.log('UI server started...');
          clearInterval(timer);
          win.loadURL(uiURL);
        })
        .catch(() => console.log('Waiting for UI to start...'));
    }, 2000);
  }

  return win;
}

app.whenReady().then(() => {
  const win = createWindow();

  // listen for ipc
  ipcMain.on(IPC_CHANNELS.OPEN_FOLDER_DIALOG, (evt) => {
    dialog
      .showOpenDialog(win, {
        title: 'Select path',
        properties: ['openDirectory']
      })
      .then((result) =>
        evt.reply(IPC_CHANNELS.OPEN_FOLDER_DIALOG, {
          error: false,
          selectedPath: result.filePaths.length > 0 ? result.filePaths[0] : null
        })
      )
      .catch((err) => {
        evt.reply(IPC_CHANNELS.OPEN_FOLDER_DIALOG, {
          error: err,
          selectedPath: null
        });
      });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
