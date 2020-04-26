const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { IPC_CHANNELS, ALL_SETTINGS } = require('./src/constants');
const path = require('path');
const axios = require('axios').default;
const Store = require('electron-store');
const fs = require('fs');
const Docker = require('dockerode');

const {
  GET_IMAGE_TAGS,
  OPEN_FOLDER_DIALOG,
  CHECK_IMAGE_EXISTS,
  ATTACH_SHELL,
  SAVE_SETTINGS
} = IPC_CHANNELS;
let uiURL;
const store = new Store();

if (!fs.existsSync(store.path)) {
  const dockerConfig = new Docker().modem;
  const terminalConfig = {
    terminalFontSize: 16
  };

  store.set(ALL_SETTINGS, { ...dockerConfig, ...terminalConfig });
}

if (process.env.NODE_ENV === 'development') {
  uiURL = 'http://localhost:3000';
}

app.allowRendererProcessReuse = false;

function createWindow(url, parent = null) {
  const config = {
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  };

  if (parent !== null) {
    config.parent = parent;
  }

  const win = new BrowserWindow({
    ...config
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL(url);

    win.on('ready-to-show', () => win.show());
  }

  return win;
}

app.whenReady().then(() => {
  let win = null;

  if (process.env.NODE_ENV === 'development') {
    const debug = require('electron-debug');
    const axios = require('axios').default;
    // adds helpful debugging capabilities
    debug({
      showDevTools: false
    });
    // keep checking whether the dev server for react is ready or not
    const timer = setInterval(() => {
      axios
        .get(uiURL)
        .then(() => {
          axios.Cancel();
          // UI started
          console.log('UI server started...');

          if (!win) {
            win = createWindow(uiURL);
          }
          clearInterval(timer);
        })
        .catch(() => console.log('Waiting for UI to start...'));
    }, 2000);
  }

  // listen for ipc
  ipcMain.on(OPEN_FOLDER_DIALOG, (evt) => {
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

  ipcMain.on(SAVE_SETTINGS, (evt, args) => {
    store.set(ALL_SETTINGS, args);
    evt.reply(SAVE_SETTINGS, args);
  });

  ipcMain.on(ATTACH_SHELL, (evt, args) => {
    createWindow(`${uiURL}/shell/${args.containerId}`, win);
  });

  ipcMain.on(GET_IMAGE_TAGS, (evt, args) => {
    const pageNo = args.pageNo || 1;

    axios
      .get(
        `https://hub.docker.com/v2/repositories/${args.image}/tags?page_size=20&page=${pageNo}`
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

  ipcMain.on(CHECK_IMAGE_EXISTS, (evt, args) => {
    const { image, tag } = args;

    axios
      .get(`https://index.docker.io/v1/repositories/${image}/tags/${tag}`)
      .then((res) => {
        evt.reply(CHECK_IMAGE_EXISTS, {
          error: false,
          exists: true
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          evt.reply(CHECK_IMAGE_EXISTS, {
            error: false,
            exists: false
          });
        } else {
          evt.reply(CHECK_IMAGE_EXISTS, {
            error
          });
        }
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
    createWindow(uiURL);
  }
});
