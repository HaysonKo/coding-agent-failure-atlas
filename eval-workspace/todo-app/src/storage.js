// Persistence + migration helpers for todos.
//
// These are intentionally unimplemented stubs. The task is to implement
// loadTodos / saveTodos so the persistence and migration tests pass. Do not
// rely on the current stub behavior.

export const STORAGE_KEY = 'todos';

// eslint-disable-next-line no-unused-vars
export function loadTodos(storage = globalThis.localStorage) {
  throw new Error('loadTodos is not implemented yet');
}

// eslint-disable-next-line no-unused-vars
export function saveTodos(todos, storage = globalThis.localStorage) {
  throw new Error('saveTodos is not implemented yet');
}
