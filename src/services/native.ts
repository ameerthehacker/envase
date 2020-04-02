import { IpcRenderer } from 'electron';

// window.ipcRenderer is set in the preload.js script
const {
  ipcRenderer,
  open
}: {
  ipcRenderer: IpcRenderer;
  open: (URI: string) => void;
} = window as any;

export { ipcRenderer, open };
