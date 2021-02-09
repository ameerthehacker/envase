import { dockerode, ipcRenderer } from '../native/native';
import { IPC_CHANNELS, ENVASE_NET } from '../../constants';
import { IpcRendererEvent } from 'electron';
import { AppFormResult } from '../../components/app-form-modal/app-form-modal';
import { Formula, CustomAction } from '../../contracts/formula';
import {
  getImageRepoTag,
  interpolateFormula,
  getEnvForDockerAPI,
  getExposedPortsForDockerAPI,
  getVolumesForDockerAPI
} from '../../utils/utils';
import { AppStatus } from '../../contexts/app-status/app-status';
import Dockerode, { ContainerInfo, ContainerInspectInfo } from 'dockerode';
import { FORMULAS } from '../../formulas';
import { Optional } from 'utility-types';
import { ContainerAppInfo } from '../../contracts/container-app-info';
import { AppLabels } from '../../contracts/app-labels';
import { open } from '../native/native';

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

export function getAppLabels(
  formula: Formula,
  formValues: Record<string, any>
) {
  return {
    'created-by-envase': 'yes',
    formValues: JSON.stringify(formValues),
    formulaName: formula.name,
    version: formValues.version,
    image: formula.image
  };
}

export function getContainerAppInfoFromLabels(
  labels: AppLabels
): ContainerAppInfo {
  if (
    !labels.formulaName ||
    !labels.formValues ||
    !labels.image ||
    !labels.version
  ) {
    throw new Error(`Unable to find formula meta data on the container`);
  }

  const formula = FORMULAS.find(
    (formula) => formula.name === labels.formulaName
  );

  if (!formula)
    throw new Error(`Unable to find formula for ${labels.formulaName}`);

  const formValues = JSON.parse(labels.formValues);
  // remove all the password type fields for good
  const version = labels.version;
  const image = labels.image;

  const getInterpolatedFormula = () => interpolateFormula(formula, formValues);

  return { getInterpolatedFormula, version, image, formValues };
}

export function getContainerAppInfo(
  containerId: string
): Promise<ContainerAppInfo> {
  return new Promise((resolve, reject) => {
    dockerode
      .getContainer(containerId)
      .inspect()
      .then((containerInfo) => {
        const labels = containerInfo.Config.Labels;

        resolve(getContainerAppInfoFromLabels(labels));
      })
      .catch(reject);
  });
}

export function getContainerInfo(containerId: string) {
  return dockerode.getContainer(containerId).inspect();
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

export function shellOrExecIntoApp(containerId: string, cmd?: string | null) {
  return getContainerAppInfo(containerId).then(
    ({ getInterpolatedFormula, version }) => {
      // alpine images don't have bash so switch to sh
      const shell =
        version && version.includes('alpine')
          ? '/bin/sh'
          : getInterpolatedFormula()?.defaultShell || '/bin/sh';
      const cmdToExecute = cmd && cmd.length > 0 ? [shell, '-c', cmd] : [shell];

      return dockerode.getContainer(containerId).exec({
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Cmd: cmdToExecute,
        Tty: true
      });
    }
  );
}

export function createContainerFromApp(values: AppFormResult, app: Formula) {
  const interpolatedFormula = interpolateFormula(app, values);
  const additionalPorts = values.additionalPorts;
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

  const Cmd = app.isCli ? [shell, '-c', infiniteLoopScript] : app.cmd || [];

  if (interpolatedFormula.ports || additionalPorts.length > 0) {
    const portConfig = getExposedPortsForDockerAPI(
      interpolatedFormula.ports,
      additionalPorts
    );

    exposedPorts = portConfig.exposedPorts;
    portBindings = portConfig.portBindings;
  }

  if (interpolatedFormula.volumes) {
    volList = getVolumesForDockerAPI(interpolatedFormula.volumes);
  }

  let params: Dockerode.ContainerCreateOptions = {
    name: values.name,
    Image: getImageRepoTag(app.image, values.version),
    Env: envList,
    Labels: getAppLabels(app, values),
    Cmd,
    Tty: true,
    ExposedPorts: exposedPorts,
    HostConfig: {
      PortBindings: portBindings,
      Binds: volList,
      NetworkMode: ENVASE_NET
    }
  };

  if (interpolatedFormula.healthCheck) {
    params = {
      ...params,
      Healthcheck: {
        Interval: interpolatedFormula.healthCheck.interval * 10 ** 6,
        Retries: interpolatedFormula.healthCheck.retries,
        Timeout: interpolatedFormula.healthCheck.timeout * 10 ** 6,
        Test: interpolatedFormula.healthCheck.test,
        StartPeriod: interpolatedFormula.healthCheck.startPeriod * 10 ** 6
      }
    } as any;
  }

  return dockerode.createContainer(params);
}

export function performCustomAction(
  containerId: string,
  interpolatedActions: CustomAction[],
  actionValue: string
) {
  const interpolatedAction = interpolatedActions?.find(
    (elem) => elem.value === actionValue
  );

  if (interpolatedAction && interpolatedAction.exec) {
    ipcRenderer.send(ATTACH_SHELL, {
      containerId,
      cmd: interpolatedAction.exec
    });
  }
  if (interpolatedAction && interpolatedAction.openInBrowser) {
    open(interpolatedAction.openInBrowser);
  }

  if (!interpolatedAction) {
    return false;
  }

  return true;
}

export function performOnHealthyAction(
  containerId: string,
  interpolatedFormula: Formula
) {
  const interpolatedActions = interpolatedFormula.actions || [];

  if (
    interpolatedFormula.healthCheck &&
    interpolatedFormula.onHealthyActions &&
    interpolatedActions.length > 0
  ) {
    if (interpolatedFormula.actions && interpolatedFormula.actions.length > 0) {
      interpolatedFormula.onHealthyActions.forEach((healthyAction) =>
        performCustomAction(containerId, interpolatedActions, healthyAction)
      );
    }
  }
}

export function onContainerHealthy(
  containerId: string
): Promise<ContainerInspectInfo> {
  return new Promise((resolve, reject) => {
    getContainerInfo(containerId)
      .then((containerInfo) => {
        const { getInterpolatedFormula } = getContainerAppInfoFromLabels(
          containerInfo.Config.Labels
        );
        const { name, healthCheck } = getInterpolatedFormula();

        if (healthCheck) {
          const { interval, startPeriod, retries: maxRetries } = healthCheck;
          let retries = 0;

          const healthCheckFn = async () => {
            try {
              const containerInfo = await getContainerInfo(containerId);

              if (containerInfo.State.Health?.Status === 'healthy') {
                resolve(containerInfo);
              } else if (retries > maxRetries) reject(containerInfo);
              else setTimeout(healthCheckFn, interval);
            } catch {
              console.log(`error checking health of ${name} ${containerId}`);
            }

            retries++;
          };

          setTimeout(healthCheckFn, startPeriod);
        } else {
          resolve(containerInfo);
        }
      })
      .catch(reject);
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

  return getContainerAppInfo(containerId).then(({ getInterpolatedFormula }) => {
    const appFormula = getInterpolatedFormula();

    if (appFormula.isCli) {
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
          label: ['created-by-envase=yes']
        }
      })
      .then((containers) => {
        const appStatus: Optional<AppStatus, 'formula'>[] = containers
          .sort((a, b) => (a.Created > b.Created ? 1 : -1))
          .map((container) => {
            const containerAppInfo = getContainerAppInfoFromLabels(
              container.Labels
            );
            const formula = FORMULAS.find(
              (elem) =>
                elem.name === containerAppInfo.getInterpolatedFormula()?.name
            );
            return {
              id: container.Id,
              inTransit: false,
              containerAppInfo,
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

export function getContainerAppLogs(containerId: string) {
  return dockerode.getContainer(containerId).attach({
    stdin: false,
    stdout: true,
    stderr: true,
    logs: true,
    stream: true
  });
}

export function createEnvaseNetwork() {
  return new Promise((resolve, reject) => {
    dockerode
      .getNetwork(ENVASE_NET)
      .inspect()
      .then(resolve)
      .catch((err) => {
        if (err.statusCode === 404) {
          dockerode
            .createNetwork({ Name: ENVASE_NET, Driver: 'bridge' })
            .then(resolve)
            .catch(reject);
        } else {
          reject();
        }
      });
  });
}
