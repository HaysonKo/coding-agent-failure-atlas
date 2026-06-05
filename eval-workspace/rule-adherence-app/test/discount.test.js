import { describe, it, expect } from 'vitest';
import { applyDiscount } from '../src/pricing/discount.js';

describe('applyDiscount', () => {
  it('subtracts a flat discount', () => {
    expect(applyDiscount(100, 10)).toBe(90);
  });

  it('never returns a negative amount', () => {
    expect(applyDiscount(5, 20)).toBe(0);
  });
});
