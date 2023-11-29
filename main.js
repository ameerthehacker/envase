/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const axios = require('axios').default;
const Store = require('electron-store');
const fs = require('fs');
const Docker = require('dockerode');
const { autoUpdater } = require('electron-updater');
const {
  IPC_CHANNELS,
  ALL_SETTINGS,
  WIN_DIMENSION
} = require('./src/constants');
const {
  GET_IMAGE_TAGS,
  OPEN_FOLDER_DIALOG,
  CHECK_IMAGE_EXISTS,
  ATTACH_SHELL,
  SAVE_SETTINGS,
  CHECK_FOR_UPDATE,
  INSTALL_UPDATE
} = IPC_CHANNELS;
let uiURL;
let win = null;
const store = new Store();

// check for update
autoUpdater.autoDownload = true;

const debounce = (fn, timeout) => {
  let timer = null;

  return (...args) => {
    const debouncedFn = () => {
      timer = null;

      fn(...args);
    };

    if (timer === null) {
      timer = setTimeout(debouncedFn, timeout);
    }
  };
};

if (!fs.existsSync(store.path)) {
  const dockerConfig = new Docker().modem;
  const terminalConfig = {
    terminalFontSize: 16
  };

  store.set(ALL_SETTINGS, { ...dockerConfig, ...terminalConfig });
}

if (process.env.NODE_ENV === 'development') {
  uiURL = 'http://localhost:3000#';
} else {
  uiURL = `file:///${path.join(__dirname, 'build', 'index.html#')}`;
}

app.allowRendererProcessReuse = false;

function createWindow(url, savedWindowSize = true) {
  const winDimension = store.get(WIN_DIMENSION);
  const width = (savedWindowSize && winDimension && winDimension.width) || 900;
  const height =
    (savedWindowSize && winDimension && winDimension.height) || 600;
  const win = new BrowserWindow({
    width,
    height,
    minWidth: 700,
    minHeight: 500,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  });

  win.loadURL(url);

  win.on('ready-to-show', () => win.show());

  win.on(
    'resize',
    debounce(() => {
      if (!win.isDestroyed()) {
        const [width, height] = win.getSize();

        store.set(WIN_DIMENSION, {
          width,
          height
        });
      }
    }, 3000)
  );

  return win;
}

app.whenReady().then(() => {
  // show dev tools when debugging and during development
  if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
    const debug = require('electron-debug');

    // adds helpful debugging capabilities
    debug({
      showDevTools: false
    });
  }

  if (process.env.NODE_ENV === 'development') {
    const axios = require('axios').default;

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
  } else {
    win = createWindow(uiURL);
  }

  // listen for ipc
  ipcMain.on(OPEN_FOLDER_DIALOG, (evt, args) => {
    dialog
      .showOpenDialog(win, {
        title: 'Select path',
        properties: ['openDirectory']
      })
      .then((result) =>
        evt.reply(OPEN_FOLDER_DIALOG, {
          error: false,
          id: args.id,
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

  ipcMain.on(CHECK_FOR_UPDATE, (evt) => {
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('update-downloaded', (updateInfo) => {
      if (updateInfo) {
        evt.reply(CHECK_FOR_UPDATE, updateInfo);
      }
    });
  });

  ipcMain.on(INSTALL_UPDATE, () => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.on(ATTACH_SHELL, (evt, args) => {
    const url = `${uiURL}/shell/${args.containerId}`;

    if (args.cmd) {
      createWindow(`${url}?cmd=${args.cmd}&allowTabs=no`, false);
    } else {
      createWindow(`${url}?allowTabs=yes`, false);
    }
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
    const [namespace, repository] = image.split('/');
    axios
      .get(
        `https://hub.docker.com/v2/namespaces/${namespace}/repositories/${repository}/tags/${tag}`
      )
      .then(() => {
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

app.on('will-quit', () => {
  // if we don't check for isDestroyed we will get runtime errors
  if (win && !win.isDestroyed) {
    const [width, height] = win.getSize();

    store.set(WIN_DIMENSION, {
      height,
      width
    });
  }
});
