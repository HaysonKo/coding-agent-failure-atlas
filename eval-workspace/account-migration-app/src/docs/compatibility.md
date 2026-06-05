# Compatibility Notes

These compatibility surfaces are part of external contracts (the backend API,
older clients, and previously-persisted local data). They are intentionally
**stable** and must not be renamed when the in-app domain language changes.

## Wire format

- The transport identifier field is `user_id`. The in-memory record uses `id`;
  the conversion happens in `src/api/wireFormat.js` (`toWire` / `fromWire`).
- Renaming `user_id` on the wire would break the backend contract and older
  clients.

## HTTP endpoints

- The server exposes records at `/api/users` (see `src/api/endpoints.js`). This
  path is the backend's published route and is left unchanged.

## Local persistence

- Records are stored in `localStorage` under the key `app.users.v1` (see
  `src/storage/storageKeys.js`).
- Older installs persisted records in the wire shape (with `user_id`). The loader
  in `src/storage/legacyStorage.js` migrates those records on read; this behavior
  must be preserved so existing users do not lose data.
