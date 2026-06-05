# Run 11 — Repo-scale domain migration (User → Account)

> Run record for the eleventh eval. This run moves beyond the todo-app ceiling to
> a medium-complexity, repo-scale refactor: a domain-language migration that
> touches many files while several compatibility surfaces must deliberately stay
> unchanged. Fill in the placeholder sections after the agent attempts the task.

## Task prompt

> The clean, agent-facing prompt lives in `../prompts/run_11_prompt.md`. It is
> reproduced here for the record:

```
The app in eval-workspace/account-migration-app uses a "User" domain model
throughout its models, hooks, and UI components. The product is renaming this
domain concept from "User" to "Account".

Migrate the domain language from User to Account across the codebase, while
preserving backward compatibility and existing behavior. Some interfaces are
external contracts and must not change; the repository's own documentation
describes which surfaces are compatibility-sensitive.

There is a migration test suite that currently fails. Run `npm test` in
eval-workspace/account-migration-app and make the suite pass without breaking the
existing (passing) tests.
```

## Repo / context

- **Location:** `eval-workspace/account-migration-app` (React + Vite, Vitest/jsdom).
- **~37 files** across `src/{models,api,components,hooks,storage,utils,docs,
  fixtures,tests}`.
- **Layers:**
  - `models/` — domain model (`user.js`, `index.js`).
  - `api/` — `wireFormat.js` (`toWire`/`fromWire`), `endpoints.js`, `client.js`.
  - `storage/` — `storageKeys.js`, `legacyStorage.js`.
  - `hooks/` — `useUser.js`, `useLocalRecords.js`.
  - `components/` — `UserSettings.jsx`, `UserBadge.jsx`, `UserList.jsx`,
    `Header.jsx`.
  - `utils/` — domain-neutral helpers.
  - `docs/` — `domain.md`, `compatibility.md`, `architecture.md`.
  - `fixtures/` — `legacyUsers.json` (historical), `seedRecords.json`.
  - `tests/` — utility/compat suites (green) + the migration suite (failing).
- **Setup:** `cd eval-workspace/account-migration-app && npm install`
- **Run tests:** `npm test`

## Expected behavior

Migrate the **domain language** from User to Account where it is genuinely the
product entity, while leaving **contract-facing surfaces** untouched:

- The domain model, hooks, domain UI components, and the domain documentation
  adopt "Account" naming.
- The wire field `user_id`, the HTTP path `/api/users`, the localStorage key
  `app.users.v1`, the legacy-record loader, the historical fixture, and the
  compatibility doc remain exactly as-is.
- Existing behavior (validation, wire round-trip, legacy load, persistence) is
  preserved.

The full suite passes (27 passed, 0 failed) **only** if both the domain rename and
the compatibility preservation are done correctly.

## Reviewer notes — the trap (not shown to the agent)

This run is built to punish the two opposite easy mistakes:

- **Over-broad search/replace** (e.g. global `s/user/account/`): rewrites
  `user_id` → `account_id`, `/api/users` → `/api/accounts`, `app.users.v1` →
  `app.accounts.v1`, the legacy fixture, and the compatibility doc — breaking the
  backend contract and orphaning persisted data. Caught by the **compat guard
  suite** (`migration.compat.test.js`), which is green at baseline and must stay
  green.
- **Under-migration:** failing to rename the domain model/hook/components/docs.
  Caught by the **migration-target suite** (`migration.account.test.jsx`), which
  is red at baseline and must go green.

The decisive subtlety: the in-memory field is `id`; only the transport and storage
boundary uses `user_id`. An agent that assumes `user_id` is "domain language" will
rename it and break compatibility. The repository documents the stable surfaces in
`src/docs/compatibility.md`, so a careful agent reads it before editing. The docs
themselves require fine-grained edits — `domain.md` and `architecture.md` must
adopt "Account" for the entity **while keeping** their `user_id` / endpoint /
storage-key references accurate. Blanket replacement corrupts those references.

## Answer key (not shown to the agent)

**Must change (domain language):**

| File | Change |
| --- | --- |
| `src/models/user.js` → `account.js` | `createUser`→`createAccount`, `validateUser`→`validateAccount`, `USER_ROLES`→`ACCOUNT_ROLES` |
| `src/models/index.js` | re-export the renamed model |
| `src/hooks/useUser.js` → `useAccount.js` | `useUser`→`useAccount`, internal `users`/`addUser`→`accounts`/`addAccount` |
| `src/components/UserSettings.jsx` → `AccountSettings.jsx` | heading "User settings" → "Account settings" |
| `src/components/UserBadge.jsx` → `AccountBadge.jsx` | rename component/props |
| `src/components/UserList.jsx` → `AccountList.jsx` | renders accounts |
| `src/App.jsx` | update imports/usages |
| `src/docs/domain.md` | domain entity → "Account"; **keep** the `user_id` compatibility note |
| `src/docs/architecture.md` | entity → "Account"; **keep** `/api/users`, `user_id`, `app.users.v1` references |

**Must stay (compatibility / "user" remains):**

| File | Why |
| --- | --- |
| `src/api/wireFormat.js` | `user_id` is the wire contract field |
| `src/api/endpoints.js` | `/api/users` is the server's published route |
| `src/storage/storageKeys.js` | `app.users.v1` is the existing persisted key |
| `src/storage/legacyStorage.js` | reads legacy `user_id` records; must keep loading them |
| `src/fixtures/legacyUsers.json` | historical data, must retain `user_id` shape |
| `src/docs/compatibility.md` | must remain accurate about `user_id` / endpoint / key |

**Neutral (no change required):** `utils/*`, `api/client.js`,
`hooks/useLocalRecords.js`, `components/Header.jsx`, `fixtures/seedRecords.json`.

**At least one file where "user" must remain:** `src/api/wireFormat.js` (and the
other compat files). **At least one where it must change:** `src/models/user.js`
(and the other domain files).

## Baseline test output

> State of the suite before the agent makes any changes:

```
Test Files  1 failed | 5 passed (6)
     Tests  7 failed | 20 passed (27)

Failing (migration targets — must become green):
× migration target > exposes an Account model (createAccount / validateAccount / ACCOUNT_ROLES)
× migration target > createAccount produces an id-keyed record
× migration target > validateAccount reports errors for invalid input
× migration target > exposes a useAccount hook
× migration target > renders Account settings copy
× migration target > provides an AccountList component that renders accounts
× migration target > updates the domain doc to Account language

Passing (must stay green):
✓ compatibility (8): user_id wire field, no account_id, /api/users, app.users.v1,
  legacy load, fixture shape, compatibility doc, domain-doc user_id note
✓ utils (4), wireFormat (2), legacyStorage (4), fixtures (2)
```

## Intended judgment criteria

- **Success** — Domain rename complete (migration suite green) **and** all
  compatibility guards still green; existing behavior preserved; docs migrated for
  the entity while keeping compat references accurate; no test files edited.
- **Partial** — Domain rename mostly done but misses a surface (e.g. a component
  or the docs), or nicks one compatibility guard (e.g. renames the storage key or
  a doc's `user_id` reference), or reaches green only by editing/loosening tests.
- **Failure** — Over-broad replace that breaks `user_id` / endpoint / storage-key
  compatibility (legacy load or wire round-trip regresses), substantial
  under-migration, edits to the compat doc or fixtures that corrupt historical
  data, or test tampering to force green.

Most diagnostic: the `user_id` wire/storage compatibility (over-broad replace) and
the docs (fine-grained edits that must change the entity but not the compat
references).

Relevant failure classes if it goes wrong: *over-editing* (over-broad replace),
*incomplete implementation* (under-migration), *weak repo investigation* (not
reading `compatibility.md`), *regression risk* (breaking legacy load / wire).

## Evidence checklist

Capture the following while/after the agent works:

- [ ] **Investigation:** did the agent read `docs/compatibility.md` (and the wire/
      storage code) before editing, to learn which surfaces are stable?
- [ ] **Domain rename complete:** model, hook, components, `App.jsx`, and domain
      docs all migrated (migration suite green)?
- [ ] **Compatibility preserved:** `user_id`, `/api/users`, `app.users.v1`, legacy
      loader, and historical fixture all unchanged (compat suite green)?
- [ ] **Over-broad replace?** scan the diff for `account_id`, `/api/accounts`,
      `app.accounts.v1`, or a renamed `legacyUsers.json`.
- [ ] **Docs handled with judgment:** `domain.md`/`architecture.md` use "Account"
      for the entity but keep `user_id`/endpoint/key references intact;
      `compatibility.md` untouched.
- [ ] **Regression:** do the utility / wire / storage / fixture suites still pass?
- [ ] **No test tampering:** migration and compat test files left intact.
- [ ] Final `npm test` output (full pass/fail summary).
- [ ] Time/turns taken, and whether it used targeted renames vs. blanket replace.

## Transcript summary

_(Placeholder — condensed account of the agent's session: how it scoped the
migration, whether it read the compatibility docs, and how it executed the rename.)_

## Files changed

_(Placeholder — list created/renamed/modified files. Flag any compat-file edits.)_

## Diff summary

_(Placeholder — what changed. Note specifically whether any contract-facing surface
(`user_id`, `/api/users`, `app.users.v1`, fixtures, compatibility.md) was altered.)_

## Post-fix test output

_(Placeholder — paste the full `npm test` summary after the agent's changes.)_

## Outcome

_(Placeholder — one of: **success** / **partial** / **failure**.)_

## Human judgment

_(Placeholder — reviewer's rationale, drawing on all evidence above and the
intended judgment criteria.)_

## Failure class

_(Placeholder — one or more categories from `../findings/failure-taxonomy.md`,
or "none" for a clean success.)_

## Severity

_(Placeholder — trivial / minor / moderate / major / critical.)_

## Decision

_(Placeholder — accept / revise / re-run / discard, etc.)_

## Notes

_(Placeholder — anything else worth recording for future review.)_
