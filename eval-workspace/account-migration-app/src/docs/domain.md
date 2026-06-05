# Domain Model

The core entity of this product is the **User**. A User represents a person who
can sign in and is assigned a role.

## Shape

A User has the following in-memory fields:

- `id` — local numeric identifier
- `name` — display name
- `email` — contact address
- `role` — one of `admin`, `member`, `viewer`

The model lives in `src/models/user.js` and is created via `createUser` and
checked via `validateUser`.

## Compatibility note

Although the in-memory field is `id`, the transport and storage layers use the
legacy `user_id` field for backward compatibility (see the compatibility notes).
That field name is part of an external contract and is independent of the in-app
domain language.
