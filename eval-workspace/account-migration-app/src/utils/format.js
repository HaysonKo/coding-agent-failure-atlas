export function titleCase(value) {
  return String(value)
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');
}

export function formatDisplayName(record) {
  return record && record.name ? titleCase(record.name) : 'Unknown';
}
