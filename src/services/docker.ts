import { dockerode, ipcRenderer } from './native';
import { IPC_CHANNELS } from '../constants';
import { IpcRendererEvent } from 'electron';
import { AppFormResult } from '../components/app-form-modal/app-form-modal';
import { Formula } from '../contracts/formula';
import {
  getImageRepoTag,
  interpolateFormula,
  getEnvForDockerAPI,
  getExposedPortsForDockerAPI
} from '../utils/utils';

const { CHECK_IMAGE_EXISTS } = IPC_CHANNELS;

interface CheckImageExistsReponse {
  error: boolean | string;
  exists: boolean;
}

function doesImageExistsInDockerHub(
  image: string,
  tag: string
): Promise<CheckImageExistsReponse> {
  ipcRenderer.send(CHECK_IMAGE_EXISTS, { image, tag });

  return new Promise((resolve) => {
    const listener = (evt: IpcRendererEvent, args: CheckImageExistsReponse) => {
      resolve(args);

      ipcRenderer.removeListener(CHECK_IMAGE_EXISTS, listener);
    };

    ipcRenderer.on(CHECK_IMAGE_EXISTS, listener);
  });
}

interface CheckImageExistenceResult {
  errorWhileChecking: boolean;
  exists: boolean;
  availableLocally: boolean;
}

export interface DockerStream {
  destroy: () => void;
  aborted: boolean;
}

export interface PullProgressEvent {
  id: string;
  status: string;
  progress: string;
  progressDetail?: {
    current: number;
    total: number;
  };
}

export function checkImageExistence(
  image: string,
  tag: string
): Promise<CheckImageExistenceResult> {
  return new Promise((resolve) => {
    dockerode
      .getImage(`${image}:${tag}`)
      .inspect()
      .then(() => {
        resolve({
          exists: true,
          errorWhileChecking: false,
          availableLocally: true
        });
      })
      .catch(() => {
        doesImageExistsInDockerHub(image, tag).then(({ error, exists }) => {
          if (error) {
            resolve({
              errorWhileChecking: true,
              exists: false,
              availableLocally: false
            });
          } else if (!exists) {
            resolve({
              errorWhileChecking: false,
              exists: false,
              availableLocally: false
            });
          } else {
            resolve({
              errorWhileChecking: false,
              exists: true,
              availableLocally: false
            });
          }
        });
      });
  });
}

export function pullImage(
  image: string,
  tag: string,
  onProgress: (evt: PullProgressEvent) => void,
  onFinished: () => void
): Promise<DockerStream> {
  return new Promise((resolve, reject) => {
    dockerode.pull(`${image}:${tag}`, (err: any, stream: DockerStream) => {
      if (!err) {
        dockerode.modem.followProgress(stream, onFinished, onProgress);

        resolve(stream);
      } else {
        reject(err);
      }
    });
  });
}

export function createApp(values: AppFormResult, app: Formula) {
  const interpolatedFormula = interpolateFormula(app, values);
  const envList = getEnvForDockerAPI(interpolatedFormula.env);
  let exposedPorts, portBindings;
  let volList: string[] = [];

  if (interpolatedFormula.ports) {
    const portConfig = getExposedPortsForDockerAPI(interpolatedFormula.ports);

    exposedPorts = portConfig.exposedPorts;
    portBindings = portConfig.portBindings;
  }

  if (interpolatedFormula.volumes) {
    volList = getEnvForDockerAPI(interpolatedFormula.volumes);
  }

  return dockerode.createContainer({
    Image: getImageRepoTag(app.image, values.version),
    Env: envList,
    Labels: {
      dockapp: JSON.stringify(interpolatedFormula)
    },
    ExposedPorts: exposedPorts,
    HostConfig: {
      PortBindings: portBindings,
      Binds: volList
    }
  });
}
