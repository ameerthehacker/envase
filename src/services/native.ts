import { IpcRenderer } from 'electron';
import Dockerode from 'dockerode';

// window.ipcRenderer, window.open, window.dockerode is set in the preload.js script
// all these preloaded native modules will be used in src/services/native.ts
// this avoids the headache of webpack trying to mangle native modules and easy unit testing
const {
  ipcRenderer,
  open,
  Docker
}: {
  ipcRenderer: IpcRenderer;
  open: (URI: string) => void;
  Docker: any;
} = window as any;

const dockerode: Dockerode = new Docker();

export { ipcRenderer, open, dockerode };
