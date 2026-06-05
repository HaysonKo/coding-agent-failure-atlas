import { describe, it, expect } from 'vitest';
import legacyUsers from '../fixtures/legacyUsers.json';
import seedRecords from '../fixtures/seedRecords.json';

describe('fixtures', () => {
  it('keeps historical records in the legacy user_id shape', () => {
    expect(legacyUsers.length).toBeGreaterThan(0);
    for (const record of legacyUsers) {
      expect(record).toHaveProperty('user_id');
      expect(record).not.toHaveProperty('id');
    }
  });

  it('provides current-shape seed records keyed by id', () => {
    expect(seedRecords.length).toBeGreaterThan(0);
    for (const record of seedRecords) {
      expect(record).toHaveProperty('id');
    }
  });
});
