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

  if (clonedFormula.actions) {
    for (const i in clonedFormula.actions) {
      const action = clonedFormula.actions[i];

      clonedFormula.actions[i] = {
        ...action,
        exec: action.exec && interpolate(action.exec, data),
        openInBrowser:
          action.openInBrowser && interpolate(action.openInBrowser, data)
      };
    }
  }

  if (clonedFormula.cmd) {
    for (const i in clonedFormula.cmd) {
      clonedFormula.cmd[i] = interpolate(clonedFormula.cmd[i], data);
    }
  }

  if (clonedFormula.healthCheck) {
    for (const i in clonedFormula.healthCheck.test) {
      clonedFormula.healthCheck.test[i] = interpolate(
        clonedFormula.healthCheck.test[i],
        data
      );
    }
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

export function getExposedPortsForDockerAPI(
  ports: Record<string, string> | undefined,
  additionalPorts: string[]
) {
  type HostConfig = {
    HostPort: string;
  };

  const portBindings: Record<string, HostConfig[]> = {};
  const exposedPorts: Record<string, {}> = {};

  for (const port in ports) {
    portBindings[`${port}/tcp`] = [
      {
        HostPort: String(ports[port])
      }
    ];
    exposedPorts[`${port}/tcp`] = {};
  }

  for (const additionalPort of additionalPorts) {
    portBindings[`${additionalPort}/tcp`] = [
      {
        HostPort: String(additionalPort)
      }
    ];
    exposedPorts[`${additionalPort}/tcp`] = {};
  }

  return { portBindings, exposedPorts };
}

export function getVolumesForDockerAPI(volumes: Record<string, string>) {
  const volumeList = [];

  for (const volume in volumes) {
    if (volumes[volume] && volumes[volume].length > 0) {
      volumeList.push(`${volumes[volume]}:${volume}`);
    }
  }

  return volumeList;
}

export function requiredValidator(fieldName: string, aliasName?: string) {
  return (value: string) => {
    let error;

    if (!value || String(value).trim().length === 0) {
      error = `${aliasName || keyToLabelText(fieldName)} is required`;
    }

    return error;
  };
}

export function isValidContainerName(name: string) {
  // https://regexr.com/3bsog
  const validNameRegEx = /^[a-z0-9]+(?:[._-]{1,2}[a-z0-9]+)*$/;

  return validNameRegEx.test(name);
}

export function getAllTags(formulas: Formula[]): Record<string, boolean> {
  const tags = new Set<string>();

  formulas.forEach((formula) => {
    formula.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags)
    .sort()
    .reduce<Record<string, boolean>>((obj, elem: string) => {
      obj[elem] = false;

      return obj;
    }, {});
}

export function getReleaseNotes(releaseNotes: string): string[] {
  const releaseNotesHolder = document.createElement('div');

  releaseNotesHolder.innerHTML = releaseNotes;

  return Array.from(releaseNotesHolder.getElementsByTagName('li')).map(
    (item) => item.innerHTML
  );
}
