import { RECORDS_KEY } from './storageKeys.js';
import { fromWire } from '../api/wireFormat.js';

// Bring a stored record up to the current in-memory shape.
//
// COMPATIBILITY: older installs persisted records in the wire shape, i.e. with a
// `user_id` field. Such records must still load. When `user_id` is present we
// treat the record as a legacy/wire record and convert it; otherwise it is
// already in the in-memory shape.
export function migrateLegacyRecord(raw) {
  const record = 'user_id' in raw ? fromWire(raw) : raw;
  return {
    id: record.id ?? null,
    name: record.name ?? '',
    email: record.email ?? '',
    role: record.role ?? 'member',
  };
}

export function loadRecords(storage = globalThis.localStorage) {
  const rawValue = storage ? storage.getItem(RECORDS_KEY) : null;
  if (rawValue == null) return [];

  let parsed;
  try {
    parsed = JSON.parse(rawValue);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];
  return parsed.map(migrateLegacyRecord);
}

export function saveRecords(records, storage = globalThis.localStorage) {
  if (!storage) return;
  storage.setItem(RECORDS_KEY, JSON.stringify(records));
}
