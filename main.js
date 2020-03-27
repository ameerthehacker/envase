const { app, BrowserWindow } = require('electron');

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
}

app.whenReady().then(createWindow);

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
