// this script sets all the native modules which would cause problems due to webpack bundling
// this also makes it easy to mock them
const { ipcRenderer } = require('electron');

window.ipcRenderer = ipcRenderer;
