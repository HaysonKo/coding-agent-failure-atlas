// Persistence + migration helpers for todos.
//
// loadTodos reads the saved todos, recovers gracefully from invalid data, and
// migrates older todo shapes (missing `completed` or `id`) to the current one.
// saveTodos serializes the todos to storage.

import { generateId } from './todoLogic.js';

export const STORAGE_KEY = 'todos';

// Bring a stored todo up to the current shape without dropping extra fields.
function migrateTodo(todo) {
  return {
    ...todo,
    id: todo.id ?? generateId(),
    completed: todo.completed ?? false,
  };
}

export function loadTodos(storage = globalThis.localStorage) {
  const raw = storage ? storage.getItem(STORAGE_KEY) : null;
  if (raw == null) return [];

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Corrupt/invalid JSON — recover to an empty list rather than crashing.
    return [];
  }

  if (!Array.isArray(parsed)) return [];
  return parsed.map(migrateTodo);
}

export function saveTodos(todos, storage = globalThis.localStorage) {
  if (!storage) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
