import { describe, it, expect } from 'vitest';
import { toWire, fromWire } from '../api/wireFormat.js';

describe('wireFormat', () => {
  it('serializes the in-memory id as the wire field user_id', () => {
    expect(toWire({ id: 7, name: 'A', email: 'a@b.co', role: 'admin' })).toEqual({
      user_id: 7,
      name: 'A',
      email: 'a@b.co',
      role: 'admin',
    });
  });

  it('round-trips a record through the wire format', () => {
    const record = { id: 7, name: 'A', email: 'a@b.co', role: 'admin' };
    expect(fromWire(toWire(record))).toEqual(record);
  });
});
