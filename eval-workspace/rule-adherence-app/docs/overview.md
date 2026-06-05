# Overview

This library computes order totals for a checkout flow.

- `calculateTotal({ subtotal, discount, taxRate })` — the main entry point.
- `applyDiscount(amount, discount)` — subtracts a flat discount, floored at zero.
- `applyTax(amount, taxRate)` — adds a percentage tax.
- `formatMoney(amount)` — formats a number as a currency string.
- `roundCents(amount)` — the shared rounding helper.

The public surface is re-exported from `src/index.js`. The exact ordering of
discount and tax is defined in `docs/pricing-rules.md`.
