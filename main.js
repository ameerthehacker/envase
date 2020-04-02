const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { IPC_CHANNELS } = require('./src/constants');
const path = require('path');
const axios = require('axios').default;

const { GET_IMAGE_TAGS, OPEN_FOLDER_DIALOG } = IPC_CHANNELS;

app.allowRendererProcessReuse = true;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
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
        evt.reply(OPEN_FOLDER_DIALOG, {
          error: false,
          selectedPath: result.filePaths.length > 0 ? result.filePaths[0] : null
        })
      )
      .catch((err) => {
        evt.reply(OPEN_FOLDER_DIALOG, {
          error: err,
          selectedPath: null
        });
      });
  });

  ipcMain.on(GET_IMAGE_TAGS, (evt, args) => {
    axios
      .get(
        `https://hub.docker.com/v2/repositories/${args.image}/tags?page_size=50`
      )
      .then((res) => res.data)
      .then((res) =>
        evt.reply(GET_IMAGE_TAGS, {
          error: false,
          res
        })
      )
      .catch((error) =>
        evt.reply(GET_IMAGE_TAGS, {
          error
        })
      );
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
