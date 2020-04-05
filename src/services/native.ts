import { IpcRenderer } from 'electron';
import Dockerode from 'dockerode';

// window.ipcRenderer, window.open, window.dockerode is set in the preload.js script
// all these preloaded native modules will be used in src/services/native.ts
// this avoids the headache of webpack trying to mangle native modules and easy unit testing
const {
  ipcRenderer,
  open,
  dockerode
}: {
  ipcRenderer: IpcRenderer;
  open: (URI: string) => void;
  dockerode: Dockerode;
} = window as any;

export { ipcRenderer, open, dockerode };
