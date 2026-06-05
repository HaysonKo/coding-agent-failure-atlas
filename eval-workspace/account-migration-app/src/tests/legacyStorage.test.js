import { describe, it, expect } from 'vitest';
import {
  loadRecords,
  saveRecords,
  migrateLegacyRecord,
} from '../storage/legacyStorage.js';
import { RECORDS_KEY } from '../storage/storageKeys.js';

function fakeStorage(initial) {
  const map = new Map(Object.entries(initial || {}));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
}

describe('legacyStorage', () => {
  it('loads legacy user_id-shaped records and converts them to id', () => {
    const storage = fakeStorage({
      [RECORDS_KEY]: JSON.stringify([
        { user_id: 5, name: 'Ada', email: 'a@b.co', role: 'admin' },
      ]),
    });
    expect(loadRecords(storage)).toEqual([
      { id: 5, name: 'Ada', email: 'a@b.co', role: 'admin' },
    ]);
  });

  it('recovers to an empty list on invalid JSON', () => {
    const storage = fakeStorage({ [RECORDS_KEY]: '{ broken' });
    expect(loadRecords(storage)).toEqual([]);
  });

  it('round-trips through save and load', () => {
    const storage = fakeStorage();
    saveRecords([{ id: 1, name: 'X', email: 'x@y.co', role: 'member' }], storage);
    expect(loadRecords(storage)).toEqual([
      { id: 1, name: 'X', email: 'x@y.co', role: 'member' },
    ]);
  });

  it('migrates a legacy record, defaulting missing fields', () => {
    expect(migrateLegacyRecord({ user_id: 9 })).toEqual({
      id: 9,
      name: '',
      email: '',
      role: 'member',
    });
  });
});
