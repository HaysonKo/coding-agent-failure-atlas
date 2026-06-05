import { describe, it, expect } from 'vitest';
import { formatMoney } from '../src/format.js';

describe('formatMoney', () => {
  it('formats an amount as currency', () => {
    expect(formatMoney(99)).toBe('$99.00');
    expect(formatMoney(5.5)).toBe('$5.50');
  });
});
