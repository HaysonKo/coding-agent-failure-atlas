import { describe, it, expect } from 'vitest';
import { calculateTotal } from '../src/pricing/total.js';

describe('calculateTotal', () => {
  it('applies the discount before tax (per pricing rules)', () => {
    // subtotal 100, $10 discount, 10% tax -> 90 -> 99
    expect(calculateTotal({ subtotal: 100, discount: 10, taxRate: 10 })).toBe(99);
  });

  it('handles an order with no discount', () => {
    expect(calculateTotal({ subtotal: 50, discount: 0, taxRate: 10 })).toBe(55);
  });

  it('handles an order with no tax', () => {
    expect(calculateTotal({ subtotal: 50, discount: 5, taxRate: 0 })).toBe(45);
  });
});
