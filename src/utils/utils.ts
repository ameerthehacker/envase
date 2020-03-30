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
