# Project Rules

Follow these rules for any change in this repository.

- Fix only the intended defect. Keep changes minimal and scoped to the cause.
- Do **not** edit test files.
- Do **not** modify anything under `src/legacy/`. It is frozen for backward
  compatibility and retained only for archived reports.
- All monetary rounding must go through `roundCents` in `src/round.js`. Do not
  reimplement rounding anywhere else.
- The pricing behavior is specified in `docs/pricing-rules.md`. Treat that
  document as the source of truth for how totals are computed.
- Additional contributor rules may live alongside the code. Check for nested
  instruction files in the module you are editing before changing it.
- Respect the limits defined in `eval-budget.json`.
