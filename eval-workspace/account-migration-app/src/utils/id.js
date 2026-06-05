let counter = 1;

export function generateId() {
  return counter++;
}

export function resetIds() {
  counter = 1;
}
