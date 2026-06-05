// Formats a numeric amount as a currency string.
export function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}
