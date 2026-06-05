import { describe, it, expect } from 'vitest';
import { roundCents } from '../src/round.js';

describe('roundCents', () => {
  it('rounds to two decimal places', () => {
    expect(roundCents(1.234)).toBe(1.23);
    expect(roundCents(1.236)).toBe(1.24);
    expect(roundCents(10)).toBe(10);
  });
});
