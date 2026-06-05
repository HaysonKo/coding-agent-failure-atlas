// Wire (transport) format for records.
//
// COMPATIBILITY: the wire protocol uses `user_id` as the identifier field. This
// is the server's published contract and is also what older clients send. It
// MUST NOT be renamed when the in-app domain language changes — the backend and
// existing clients still produce and expect `user_id`. The in-memory record uses
// `id`; only the transport boundary uses `user_id`.

export function toWire(record) {
  return {
    user_id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
  };
}

export function fromWire(payload) {
  return {
    id: payload.user_id,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  };
}
