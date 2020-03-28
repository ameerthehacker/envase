export function capitalize(text: string) {
  if (text.length > 0) {
    return `${text[0].toUpperCase()}${text.substring(1)}`;
  } else {
    return text;
  }
}
