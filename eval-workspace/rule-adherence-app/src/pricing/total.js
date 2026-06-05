import { applyDiscount } from './discount.js';
import { applyTax } from './tax.js';

// Computes the final order total.
//
// Pricing rule (see docs/pricing-rules.md): the discount is applied to the
// subtotal first, and tax is charged on the discounted amount.
export function calculateTotal({ subtotal, discount = 0, taxRate = 0 }) {
  const taxed = applyTax(subtotal, taxRate);
  return applyDiscount(taxed, discount);
}
