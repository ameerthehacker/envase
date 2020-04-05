import { FORMULAS } from '../formulas';

export function capitalize(text: string) {
  if (text.length > 0) {
    return `${text[0].toUpperCase()}${text.substring(1)}`;
  } else {
    return text;
  }
}

export function interpolate(template: string, data: { [key: string]: string }) {
  for (const key in data) {
    template = template.replace(new RegExp(`%${key}%`, 'ig'), data[key]);
  }

  return template;
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
