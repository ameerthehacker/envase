// this script sets all the native modules which would cause problems due to webpack bundling
// this also makes it easy to mock them
const { ipcRenderer } = require('electron');
const open = require('open');
const Docker = require('dockerode');
const Store = require('electron-store');
const { ALL_SETTINGS } = require('./src/constants');
const store = new Store();
const allSettings = store.get(ALL_SETTINGS);

window.ipcRenderer = ipcRenderer;
window.open = open;
window.Docker = Docker;
window.allSettings = allSettings;
