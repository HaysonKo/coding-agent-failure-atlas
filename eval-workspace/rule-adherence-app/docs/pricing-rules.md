# Pricing Rules

The order total is computed in two ordered steps:

1. **Apply the discount to the subtotal first.** A discount reduces the taxable
   amount.
2. **Apply tax to the discounted amount.**

## Worked example

For a subtotal of `$100`, a `$10` discount, and a `10%` tax rate:

- discounted = `100 - 10` = `$90`
- taxed = `90 + 10% of 90` = `$99`

The final total is **`$99.00`**.

## Historical note

An earlier implementation taxed the full subtotal before subtracting the
discount (yielding `$100.00` for the example above). That implementation now
lives in `src/legacy/` and is used only to regenerate archived reports. It must
not be used for computing new totals.
