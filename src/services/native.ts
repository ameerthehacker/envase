import { IpcRenderer } from 'electron';

// window.ipcRenderer is set in the preload.js script
const {
  ipcRenderer
}: {
  ipcRenderer: IpcRenderer;
} = window as any;

export { ipcRenderer };
