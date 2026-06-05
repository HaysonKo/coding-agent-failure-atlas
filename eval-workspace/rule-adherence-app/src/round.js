// Shared monetary rounding. All money math must round through this helper.
export function roundCents(amount) {
  return Math.round(amount * 100) / 100;
}
