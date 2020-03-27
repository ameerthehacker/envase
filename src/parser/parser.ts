function interpolate(template: string, data: { [key: string]: string }) {
  for (let key in data) {
    template = template.replace(new RegExp(`%${key}%`, 'ig'), data[key]);
  }

  return template;
}

export { interpolate };
