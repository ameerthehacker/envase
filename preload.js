// this script sets all the native modules which would cause problems due to webpack bundling
// this also makes it easy to mock them
const { ipcRenderer } = require('electron');
const open = require('open');

window.ipcRenderer = ipcRenderer;
window.open = open;
