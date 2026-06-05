# Pricing module rules

These rules apply to everything in `src/pricing/`.

- `calculateTotal` is part of the public API. Keep its signature — a single
  options object `{ subtotal, discount, taxRate }` — unchanged.
- Pricing functions must be pure: do not mutate inputs and do not add side
  effects.
- Compose the existing `applyDiscount` and `applyTax` helpers. Do not inline new
  discount or tax arithmetic in `total.js`.
