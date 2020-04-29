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
import { AppStatus } from '../contexts/app-status/app-status';
import { ContainerInfo } from 'dockerode';
import { FORMULAS } from '../formulas';
import { Optional } from 'utility-types';

const { CHECK_IMAGE_EXISTS, ATTACH_SHELL } = IPC_CHANNELS;

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

export function getAppsWithName(name: string) {
  return dockerode.listContainers({
    all: true,
    filters: {
      name: [name]
    }
  });
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

export function shellIntoApp(containerId: string) {
  const container = dockerode.getContainer(containerId);

  return container.inspect().then((containerInfo) => {
    const formula: Formula = JSON.parse(containerInfo.Config.Labels.dockapp);
    const version = containerInfo.Config.Labels.version;
    // alpine images don't have bash so switch to sh
    const shell =
      version && version.includes('alpine') ? '/bin/sh' : formula.defaultShell;

    return dockerode.getContainer(containerId).exec({
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Cmd: [shell],
      Tty: true
    });
  });
}

export function createContainerFromApp(values: AppFormResult, app: Formula) {
  const interpolatedFormula = interpolateFormula(app, values);
  const envList = getEnvForDockerAPI(interpolatedFormula.env);
  let exposedPorts, portBindings;
  let volList: string[] = [];
  // prevents containers from stopping
  const infiniteLoopScript = `
  exit_script() {
    exit;
  }
  trap exit_script SIGINT SIGTERM
  while true
  do
    :
  done
  `;
  // alpine images don't have bash so switch to sh
  const shell =
    values.version && values.version.includes('alpine')
      ? '/bin/sh'
      : app.defaultShell;

  const Cmd = app.isCli ? [shell, '-c', infiniteLoopScript] : [];

  if (interpolatedFormula.ports) {
    const portConfig = getExposedPortsForDockerAPI(interpolatedFormula.ports);

    exposedPorts = portConfig.exposedPorts;
    portBindings = portConfig.portBindings;
  }

  if (interpolatedFormula.volumes) {
    volList = getEnvForDockerAPI(interpolatedFormula.volumes);
  }

  return dockerode.createContainer({
    name: values.name,
    Image: getImageRepoTag(app.image, values.version),
    Env: envList,
    Labels: {
      dockapp: JSON.stringify(interpolatedFormula),
      'created-by-dockapp': 'yes',
      version: values.version,
      image: app.image
    },
    Cmd,
    ExposedPorts: exposedPorts,
    HostConfig: {
      PortBindings: portBindings,
      Binds: volList
    }
  });
}

function getAppContainerState(container: ContainerInfo) {
  switch (container.State) {
    case 'running':
      return 'running';
    case 'exited':
      return 'stopped';
    default:
      return 'stopped';
  }
}

export function startApp(containerId: string) {
  const container = dockerode.getContainer(containerId);

  return container.inspect().then((containerInfo) => {
    const formula: Formula = JSON.parse(containerInfo.Config.Labels.dockapp);

    if (formula.isCli) {
      return new Promise((resolve, reject) => {
        container
          .start()
          .then(() => {
            ipcRenderer.send(ATTACH_SHELL, { containerId: container.id });

            resolve();
          })
          .catch(reject);
      });
    } else {
      return container.start();
    }
  });
}

export function stopApp(containerId: string) {
  return dockerode.getContainer(containerId).stop();
}

export function deleteApp(containerId: string) {
  return dockerode.getContainer(containerId).remove();
}

export function listContainerApps(): Promise<AppStatus[]> {
  return new Promise((resolve, reject) => {
    dockerode
      .listContainers({
        all: true,
        filters: {
          label: ['created-by-dockapp=yes']
        }
      })
      .then((containers) => {
        const appStatus: Optional<AppStatus, 'formula'>[] = containers
          .sort((a, b) => (a.Created > b.Created ? 1 : -1))
          .map((container) => {
            const appName = JSON.parse(container.Labels['dockapp']).name;
            const formula = FORMULAS.find((elem) => elem.name === appName);

            return {
              id: container.Id,
              inTransit: false,
              name: container.Names[0].substring(1),
              state: getAppContainerState(container),
              formula,
              isDeleting: false
            };
          });

        resolve(appStatus.filter((status) => status.formula) as AppStatus[]);
      })
      .catch((err) => reject(err));
  });
}

export function getContainerAppLogs(id: string) {
  return dockerode.getContainer(id).logs({
    stdout: true,
    stderr: true,
    follow: true
  });
}
