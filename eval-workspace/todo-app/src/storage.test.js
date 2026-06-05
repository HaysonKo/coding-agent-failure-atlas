import { describe, it, expect } from 'vitest';
import { loadTodos, saveTodos, STORAGE_KEY } from './storage.js';

// A minimal in-memory stand-in for the Web Storage API.
function fakeStorage(initial) {
  const map = new Map(Object.entries(initial || {}));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
}

describe('storage', () => {
  it('returns an empty list when nothing is stored', () => {
    expect(loadTodos(fakeStorage())).toEqual([]);
  });

  it('round-trips saved todos', () => {
    const storage = fakeStorage();
    const todos = [{ id: 1, text: 'Buy milk', completed: false }];

    saveTodos(todos, storage);

    expect(loadTodos(storage)).toEqual(todos);
  });

  it('recovers to an empty list when the stored value is invalid JSON', () => {
    const storage = fakeStorage({ [STORAGE_KEY]: '{ not valid json' });

    expect(loadTodos(storage)).toEqual([]);
  });

  it('defaults a missing completed flag to false', () => {
    const storage = fakeStorage({
      [STORAGE_KEY]: JSON.stringify([{ id: 1, text: 'Legacy' }]),
    });

    const result = loadTodos(storage);

    expect(result[0].completed).toBe(false);
  });

  it('assigns a stable id to todos that are missing one', () => {
    const storage = fakeStorage({
      [STORAGE_KEY]: JSON.stringify([{ text: 'a' }, { text: 'b' }]),
    });

    const result = loadTodos(storage);

    expect(result[0].id).toBeDefined();
    expect(result[1].id).toBeDefined();
    expect(result[0].id).not.toBe(result[1].id);
  });

  it('preserves text and completion when migrating', () => {
    const storage = fakeStorage({
      [STORAGE_KEY]: JSON.stringify([{ text: 'Done thing', completed: true }]),
    });

    const result = loadTodos(storage);

    expect(result[0].text).toBe('Done thing');
    expect(result[0].completed).toBe(true);
  });
});
