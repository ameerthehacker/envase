import { FORMULAS } from '../formulas';
import { Formula } from '../contracts/formula';
import { cloneDeep } from 'lodash-es';

export function capitalize(text: string) {
  if (text.length > 0) {
    return `${text[0].toUpperCase()}${text.substring(1)}`;
  } else {
    return text;
  }
}

export function keyToLabelText(text: string) {
  const words = text.split('_');
  // capitalize the first world
  words[0] = capitalize(words[0]);

  return words.join(' ');
}

export function interpolate(template: string, data: Record<string, string>) {
  for (const key in data) {
    template = template.replace(new RegExp(`%${key}%`, 'ig'), data[key]);
  }

  return template;
}

export function interpolateFormula(
  formula: Formula,
  data: Record<string, string>
) {
  // don't mutate here, it leads to frustrating bugs
  const clonedFormula = cloneDeep(formula);

  for (const env in clonedFormula.env) {
    clonedFormula.env[env] = interpolate(clonedFormula.env[env], data);
  }

  for (const port in clonedFormula.ports) {
    clonedFormula.ports[port] = interpolate(clonedFormula.ports[port], data);
  }

  for (const volume in clonedFormula.volumes) {
    clonedFormula.volumes[volume] = interpolate(
      clonedFormula.volumes[volume],
      data
    );
  }

  return clonedFormula;
}

export function getDockerHubLinkToTags(name: string) {
  const [namespace, image] = name.split('/');
  let relativeURL;

  if (namespace === 'library') {
    relativeURL = `_/${image}/?tab=tags`;
  } else {
    relativeURL = `r/${name}/tags`;
  }

  return `https://hub.docker.com/${relativeURL}`;
}

export function getFormulaByName(name: string) {
  return FORMULAS.find((formula) => formula.name === name);
}

export function getImageRepoTag(image: string, tag: string) {
  return `${image}:${tag}`;
}

export function getEnvForDockerAPI(env: Record<string, string>) {
  const envList = [];

  for (const envVar in env) {
    envList.push(`${envVar}=${env[envVar]}`);
  }

  return envList;
}

export function getExposedPortsForDockerAPI(ports: Record<string, string>) {
  type HostConfig = {
    HostPort: string;
  };

  const portBindings: Record<string, HostConfig[]> = {};
  const exposedPorts: Record<string, {}> = {};

  for (const port in ports) {
    portBindings[`${port}/tcp`] = [
      {
        HostPort: ports[port]
      }
    ];
    exposedPorts[`${port}/tcp`] = {};
  }

  return { portBindings, exposedPorts };
}

export function getVolumesForDockerAPI(volumes: Record<string, string>) {
  const volumeList = [];

  for (const volume in volumes) {
    volumeList.push(`${volumes[volume]}:${volume}`);
  }

  return volumeList;
}
