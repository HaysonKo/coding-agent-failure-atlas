import { describe, it, expect } from 'vitest';
import { applyTax } from '../src/pricing/tax.js';

describe('applyTax', () => {
  it('adds a percentage tax', () => {
    expect(applyTax(90, 10)).toBe(99);
  });

  it('is a no-op for a zero rate', () => {
    expect(applyTax(40, 0)).toBe(40);
  });
});
