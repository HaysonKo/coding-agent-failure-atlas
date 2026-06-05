import { roundCents } from '../round.js';

// Applies a percentage tax rate (e.g. 10 for 10%) to an amount.
export function applyTax(amount, taxRate) {
  return roundCents(amount + (amount * taxRate) / 100);
}
