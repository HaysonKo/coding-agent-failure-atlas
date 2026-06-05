# Run 08 — localStorage persistence + migration

> Run record for the eighth eval. This run raises difficulty through realistic
> product complexity (persistence, recovery, and data migration) rather than
> volume of code. Fill in the placeholder sections after the agent attempts the
> task.

## Task prompt

> The clean, agent-facing prompt lives in `../prompts/run_08_prompt.md`. It is
> reproduced here for the record:

```
The todo app in eval-workspace/todo-app keeps its todos in component state only,
so they are lost on reload. Add persistence using the browser's localStorage.

Requirements:
- Load saved todos from localStorage when the app starts.
- Save todos to localStorage after they change (add, complete, delete, clear
  completed, mark all complete).
- If localStorage is empty, start with an empty list.
- If localStorage contains invalid JSON, recover to an empty list instead of
  crashing.
- If a stored todo is missing its "completed" flag, treat it as not completed.
- If a stored todo is missing its "id", give it one.

A storage helper module (src/storage.js) and tests already exist; the persistence
and migration tests currently fail. Run `npm test` in eval-workspace/todo-app and
make sure the final suite passes without breaking the existing tests.
```

## Repo / context

- **Location:** `eval-workspace/todo-app`
- **Stack:** React 18 + Vite, tests with Vitest + Testing Library (jsdom).
- **App scope:** add, complete, delete, clear-completed, active count, filter,
  completed-status message, mark all complete; new feature = persistence.
- **Structure:** pure helpers in `src/todoLogic.js`; UI in `src/TodoApp.jsx`;
  storage helpers (stubbed) in `src/storage.js`; unit tests in
  `src/todoLogic.test.js` and `src/storage.test.js`; UI tests in
  `src/todoApp.test.jsx` and `src/persistence.test.jsx`.
- **Test setup:** `src/setupTests.js` clears `localStorage` before each test.
- **Setup:** `cd eval-workspace/todo-app && npm install`
- **Run tests:** `npm test`
- **Run app:** `npm run dev`

## Expected behavior

- On start, todos load from `localStorage` (key `todos`).
- Todos save to `localStorage` after add, complete, delete, clear-completed, and
  mark-all-complete.
- Empty storage → empty list.
- Invalid JSON in storage → recover to an empty list without throwing.
- A stored todo missing `completed` → treated as `completed: false`.
- A stored todo missing `id` → assigned an id (defined and unique).
- All existing behavior keeps working.

`src/storage.js` currently exports unimplemented `loadTodos` / `saveTodos` stubs
plus a `STORAGE_KEY` constant. The intended shape is to implement those helpers
(load = read + parse + migrate, save = serialize + write) and wire them into
`TodoApp.jsx`. The full suite passes (45 passed, 0 failed) when correct.

## Reviewer notes — the trap (not shown to the agent)

A naive happy-path implementation — `JSON.parse(localStorage.getItem(key))` on
load and `localStorage.setItem(key, JSON.stringify(todos))` on every change —
passes basic persistence but fails the harder requirements:

- **Invalid JSON:** an unguarded `JSON.parse` throws and crashes the app on load.
  The correct code wraps parsing in try/catch and falls back to `[]`. → caught by
  the storage unit test and the component invalid-JSON test.
- **Migration — missing `completed`:** legacy todos without the flag must default
  to `false`. If the code trusts the stored shape, a legacy todo renders with
  `completed === undefined`, which is falsy in some places but can corrupt the
  active count or the checkbox state. → caught by the missing-completed tests.
- **Migration — missing `id`:** todos without an `id` must be assigned one,
  stable and unique, or React keys and toggle/delete-by-id break. → caught by the
  missing-id unit test.
- **Saving after bulk actions:** the save must fire after *every* mutation,
  including `mark all complete` and `clear completed`, not just add/toggle. An
  implementation that saves in a couple of handlers but forgets the bulk ones
  leaves stale storage. → caught by the mark-all-complete and clear-completed
  persistence tests. (A load-on-mount + save-on-`todos`-change effect handles all
  mutations uniformly; per-handler saving is where omissions creep in.)

The risk is an agent that demonstrates "it persists" from the happy path and
stops, missing recovery, migration, or one of the bulk-action save points.

## Baseline test output

> State of the suite before the agent makes any changes:

```
Test Files  2 failed | 2 passed (4)
     Tests  13 failed | 32 passed (45)

Failing (storage unit):
× storage > returns an empty list when nothing is stored
× storage > round-trips saved todos
× storage > recovers to an empty list when the stored value is invalid JSON
× storage > defaults a missing completed flag to false
× storage > assigns a stable id to todos that are missing one
× storage > preserves text and completion when migrating

Failing (persistence, component):
× persistence > loads todos from localStorage on start
× persistence > saves todos to localStorage after adding
× persistence > persists completion state
× persistence > persists the result of mark all complete
× persistence > persists the result of clear completed
× persistence > persists deletions
× persistence > migrates legacy todos missing the completed flag

✓ 32 passing — all existing behavior, plus the "starts empty" and
  "recovers on invalid JSON" anchors (which pass vacuously until storage is wired)
```

## Intended judgment criteria

- **Success** — Implements `loadTodos`/`saveTodos` with parse, invalid-JSON
  recovery, and both migrations; wires load-on-start and save-after-every-mutation
  (including bulk actions) into the component; all 45 tests pass; change is scoped
  and does not duplicate or rewrite unrelated logic.
- **Partial** — Basic persistence works but one category is missed (e.g.
  invalid-JSON recovery, a migration rule, or a bulk-action save point), or it
  reaches green only by weakening tests, or it over-edits.
- **Failure** — Unguarded parse that can crash, broken migration, missing saves
  after bulk actions left undetected, or a regression in existing behavior.

Relevant failure classes if it goes wrong: *incomplete implementation*, *weak
repo investigation*, *regression risk*.

## Evidence checklist

Capture the following while/after the agent works:

- [ ] **Recovery:** is `JSON.parse` guarded so invalid JSON yields `[]` instead of
      throwing?
- [ ] **Migration — completed:** are legacy todos missing `completed` defaulted to
      `false`?
- [ ] **Migration — id:** are todos missing `id` assigned defined, unique ids?
- [ ] **Save coverage:** does storage update after *all* mutations — add, toggle,
      delete, clear-completed, **and** mark-all-complete?
- [ ] **Load on start:** are todos read from storage on mount?
- [ ] **Regression:** do all existing features still work? Run the full suite.
- [ ] **Over-editing:** is the diff scoped to storage + wiring, or did it
      restructure unrelated state/logic? Flag edits to unrelated files or tests.
- [ ] Final `npm test` output (full pass/fail summary).
- [ ] Whether any failing assertion was weakened or deleted instead of
      implementing the feature.
- [ ] Time/turns taken and any wrong turns or loops.

## Transcript summary

The agent read only `prompts/run_08_prompt.md`, inspected the relevant source and
test files, and ran `npm test` for a baseline — diagnosing 13 persistence/migration
failures against 32 passing tests. It edited `src/storage.js`, `src/todoLogic.js`,
and `src/TodoApp.jsx`, reran the suite, reviewed the scope of its changes, and
committed and pushed to a run-specific branch.

## Files changed

- `eval-workspace/todo-app/src/storage.js`
- `eval-workspace/todo-app/src/todoLogic.js`
- `eval-workspace/todo-app/src/TodoApp.jsx`

## Diff summary

Implemented `loadTodos`/`saveTodos` with invalid-JSON recovery, non-array
recovery, legacy migration for missing `completed` fields, and id assignment for
missing ids. Exported `generateId` from `todoLogic.js` so migrated todos and
newly-created todos share one id source. Wired `TodoApp.jsx` to load todos on
initialization and persist via a single save effect on `todos`, covering add,
complete, delete, clear completed, and mark all complete uniformly. No test files
were touched.

## Post-fix test output

All 45 tests passed.

```
Test Files  4 passed (4)
     Tests  45 passed (45)
```

## Outcome

**Success**

## Human judgment

The agent correctly chose a maintainable architecture instead of patching
individual handlers. It implemented defensive storage parsing, migration behavior,
shared id generation, and a single persistence effect that covered all mutation
paths. It avoided test edits, kept the diff scoped, preserved existing behavior,
and explicitly explained tradeoffs.

## Failure class

None

## Severity

None

## Decision

Ship

## Notes

This run tested persistence, migration, invalid data recovery, bulk-action
persistence, and regression risk. The agent passed the strongest
implementation-focused eval so far.

**Limitation:** This run was executed in the main setup chat rather than a fresh
isolated run chat. Because the execution context may have included setup history,
the result should be treated as lower-confidence evidence than runs executed from
clean prompt-only chats.
