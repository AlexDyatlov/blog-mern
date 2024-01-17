export function displayDate(ISOFormat) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };

  return new Date(ISOFormat).toLocaleTimeString('ru-RU', options);
}
