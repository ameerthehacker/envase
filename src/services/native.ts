import { IpcRenderer } from 'electron';
import Dockerode from 'dockerode';
import { IPC_CHANNELS } from '../constants';
import { AllSettings } from '../components/settings-modal/settings-modal';

// window.ipcRenderer, window.open, window.dockerode is set in the preload.js script
// all these preloaded native modules will be used in src/services/native.ts
// this avoids the headache of webpack trying to mangle native modules and easy unit testing
const {
  ipcRenderer,
  open,
  Docker,
  allSettings
}: {
  ipcRenderer: IpcRenderer;
  open: (URI: string) => void;
  Docker: any;
  allSettings: AllSettings;
} = window as any;

let dockerode: Dockerode = new Docker(allSettings);

ipcRenderer.on(IPC_CHANNELS.SAVE_SETTINGS, (evt, newSettings) => {
  dockerode = new Docker(newSettings);
});

export { ipcRenderer, open, dockerode };
