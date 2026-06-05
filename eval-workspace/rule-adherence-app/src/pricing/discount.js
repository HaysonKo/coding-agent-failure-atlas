import { roundCents } from '../round.js';

// Applies a flat discount amount to a subtotal. The result is never negative.
export function applyDiscount(amount, discount) {
  return roundCents(Math.max(0, amount - discount));
}
