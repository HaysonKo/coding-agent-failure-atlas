import { ENDPOINTS } from './endpoints.js';
import { fromWire, toWire } from './wireFormat.js';

// Fetches records from the server and converts them from wire shape to the
// in-memory record shape. The function name is domain-neutral on purpose.
export async function fetchRecords(fetchImpl = fetch) {
  const response = await fetchImpl(ENDPOINTS.list);
  const payload = await response.json();
  return payload.map(fromWire);
}

export function serializeRecords(records) {
  return records.map(toWire);
}
