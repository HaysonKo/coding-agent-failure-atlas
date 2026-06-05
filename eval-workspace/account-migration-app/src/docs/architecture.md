# Architecture Overview

This app is organized into layers, each in its own directory under `src/`.

- **models/** — the domain model (the Account entity) and its public
  entry point.
- **api/** — the wire format and HTTP client. The wire format maps the in-memory
  `id` to the contract field `user_id`, and the client talks to `/api/users`.
- **storage/** — local persistence under the key `app.users.v1`, including
  migration of legacy records that were stored in the wire shape.
- **hooks/** — React hooks: a domain hook for managing the working set and a
  domain-neutral persistence hook.
- **components/** — presentational UI for the domain entity plus neutral chrome.
- **utils/** — domain-neutral helpers (ids, validation, formatting).
- **docs/** — these notes.
- **fixtures/** — sample and historical data used by tests.

The domain language ("Account") flows through the model, hooks, and components.
The contract-facing fields and paths (`user_id`, `/api/users`, `app.users.v1`)
are deliberately decoupled from the domain language and stay stable across
renames.
