// Server routes are part of the external HTTP contract. The `/api/users` path is
// the backend's published endpoint; it is intentionally left unchanged even as
// the in-app domain language evolves.

export const ENDPOINTS = {
  list: '/api/users',
  detail: (id) => `/api/users/${id}`,
};
