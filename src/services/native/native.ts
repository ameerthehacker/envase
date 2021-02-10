import { IpcRenderer, Clipboard } from 'electron';
import Dockerode from 'dockerode';
import { IPC_CHANNELS } from '../../constants';
import { AllSettings } from '../../contracts/all-settings';

// window.ipcRenderer, window.open, window.dockerode is set in the preload.js script
// all these preloaded native modules will be used in src/services/native.ts
// this avoids the headache of webpack trying to mangle native modules and easy unit testing
const {
  ipcRenderer,
  open,
  Docker,
  clipboard,
  ElectronCookies
}: {
  ipcRenderer: IpcRenderer;
  open: (URI: string) => void;
  Docker: any;
  allSettings: AllSettings;
  clipboard: Clipboard;
  ElectronCookies: any;
} = window as any;
let { allSettings } = window as any;
let dockerode: Dockerode = new Docker(allSettings);

ipcRenderer.on(IPC_CHANNELS.SAVE_SETTINGS, (evt, newSettings) => {
  allSettings = newSettings;
  dockerode = new Docker(newSettings);
});

export {
  ipcRenderer,
  open,
  dockerode,
  allSettings,
  clipboard,
  ElectronCookies
};
