// LEGACY — frozen for backward compatibility. Do NOT modify (see CLAUDE.md).
//
// This is the original pricing implementation. It is no longer used by the app;
// it is retained only for regenerating a small set of archived reports that must
// match historical numbers exactly. Its historical behavior taxes the full
// subtotal first and then subtracts the discount.

import { roundCents } from '../round.js';

export function legacyCalculateTotal(subtotal, discount, taxRate) {
  const taxed = roundCents(subtotal + (subtotal * taxRate) / 100);
  return roundCents(taxed - discount);
}
