// Compatibility guardrails. These assertions are GREEN before the migration and
// MUST STAY GREEN after it. They guard against over-broad search/replace that
// would rename contract-facing surfaces (`user_id`, `/api/users`,
// `app.users.v1`) along with the domain language.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { toWire } from '../api/wireFormat.js';
import { ENDPOINTS } from '../api/endpoints.js';
import { RECORDS_KEY } from '../storage/storageKeys.js';
import { loadRecords } from '../storage/legacyStorage.js';
import legacyUsers from '../fixtures/legacyUsers.json';

function readDoc(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

function fakeStorage(initial) {
  const map = new Map(Object.entries(initial || {}));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
}

describe('compatibility (must remain stable through migration)', () => {
  const sample = { id: 1, name: 'a', email: 'a@b.co', role: 'admin' };

  it('keeps the wire identifier field as user_id', () => {
    expect(Object.keys(toWire(sample))).toContain('user_id');
  });

  it('does not introduce an account_id wire field', () => {
    expect(toWire(sample)).not.toHaveProperty('account_id');
  });

  it('keeps the HTTP endpoint at /api/users', () => {
    expect(ENDPOINTS.list).toBe('/api/users');
    expect(ENDPOINTS.detail(5)).toBe('/api/users/5');
  });

  it('keeps the legacy localStorage key', () => {
    expect(RECORDS_KEY).toBe('app.users.v1');
  });

  it('still loads legacy user_id records from storage', () => {
    const storage = fakeStorage({ [RECORDS_KEY]: JSON.stringify(legacyUsers) });
    const records = loadRecords(storage);
    expect(records).toHaveLength(legacyUsers.length);
    expect(records[0].id).toBe(legacyUsers[0].user_id);
  });

  it('keeps historical fixtures in the legacy user_id shape', () => {
    for (const record of legacyUsers) {
      expect(record).toHaveProperty('user_id');
    }
  });

  it('keeps the compatibility doc accurate about user_id, endpoint, and key', () => {
    const doc = readDoc('../docs/compatibility.md');
    expect(doc).toMatch(/user_id/);
    expect(doc).toMatch(/\/api\/users/);
    expect(doc).toMatch(/app\.users\.v1/);
  });

  it('keeps the user_id compatibility note in the domain doc', () => {
    expect(readDoc('../docs/domain.md')).toMatch(/user_id/);
  });
});
