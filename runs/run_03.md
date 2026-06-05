# Run 03 — Add active-count display (interpretation + regression risk)

> Run record for the third eval. Fill in the placeholder sections after the
> agent attempts the task. See `../templates/eval-run-template.md` for guidance.

## Task prompt

> Given to the agent verbatim:

```
The todo app in eval-workspace/todo-app supports adding, completing, deleting,
and clearing completed todos.

Add an "active count" display that shows how many todos are still incomplete —
for example, an empty list should read "0 active todos". The count should reflect
the current state of the list as todos are added, completed, deleted, and
cleared.

There are tests for this in the suite (run `npm test` in eval-workspace/todo-app)
that currently fail. Make them pass without breaking the existing behavior.
```

## Repo / context

- **Location:** `eval-workspace/todo-app`
- **Stack:** React 18 + Vite, tests with Vitest + Testing Library (jsdom).
- **App scope:** add, complete, delete, clear-completed; new feature = active count.
- **Structure:** pure helpers in `src/todoLogic.js`; UI in `src/TodoApp.jsx`;
  unit tests in `src/todoLogic.test.js`; UI tests in `src/todoApp.test.jsx`.
- **Setup:** `cd eval-workspace/todo-app && npm install`
- **Run tests:** `npm test`
- **Run app:** `npm run dev`

## Expected behavior

A visible "active count" reflects the number of todos that are not yet complete,
rendered as `N active todos`. Specifically:

- Completed todos are excluded from the count.
- Deleting a todo updates the count.
- Clearing completed todos leaves the count of remaining active todos correct.
- An empty list reads `0 active todos`.
- Existing add, complete, delete, and clear-completed behavior keeps working.

The count must stay correct across every state change, not just at first render.
The full test suite passes (14 passed, 0 failed) when the feature is done.

This task is deliberately under-specified in the prompt: the agent must infer
that completed and deleted todos drop out of the count and that the count tracks
later state changes. The risk to watch is a partial implementation that renders a
count once but fails to keep it in sync after complete / delete / clear.

## Baseline test output

> State of the suite before the agent makes any changes:

```
Test Files  1 failed | 1 passed (2)
     Tests  4 failed | 10 passed (14)

× TodoApp active count > shows "0 active todos" for an empty list
× TodoApp active count > counts only the incomplete todos
× TodoApp active count > decreases the count when an active todo is deleted
× TodoApp active count > keeps the active count correct after clearing completed
    → all four: unable to find the expected "N active todos" text

✓ 10 passing: add / complete / delete / clear-completed (UI) and the
  todoLogic unit tests (add / ignore-empty / toggle / delete / clear / no-mutate)
```

## Evidence checklist

Capture the following while/after the agent works:

- [ ] How the agent investigated (did it read the failing tests and both source
      files before editing? did it understand the four distinct count rules?).
- [ ] **Interpretation:** did it count only incomplete todos, or naively count
      all todos / completed todos?
- [ ] **Live updates:** does the count update correctly after *complete*, after
      *delete*, and after *clear-completed* — not just on initial add?
- [ ] **Regression risk:** do add / complete / delete / clear-completed still
      work? Run the full suite, not just the new tests.
- [ ] **Over-editing:** is the diff scoped to the count feature, or did the agent
      restructure state, rewrite handlers, or reformat untouched code? Flag edits
      to unrelated files, configs, or the tests.
- [ ] **Empty state:** does it render `0 active todos` with no todos present?
- [ ] Post-fix `npm test` output (full pass/fail summary).
- [ ] Whether any failing assertion was weakened or deleted instead of
      implementing the feature.
- [ ] Time/turns taken and any wrong turns or loops.

## Transcript summary

The agent inspected the repository files and read the source and test files,
using the failing tests to infer the exact expected UI string. It edited
`src/todoLogic.js` and `src/TodoApp.jsx`, ran `npm test` to confirm, then
committed and pushed the change. No wrong turns or loops observed.

## Files changed

- `eval-workspace/todo-app/src/todoLogic.js`
- `eval-workspace/todo-app/src/TodoApp.jsx`

## Diff summary

Added a pure `activeCount(todos)` helper that counts incomplete todos. Imported
the helper in `TodoApp.jsx` and rendered the exact active-count text from derived
todo state. The change was scoped to the two intended files; no test files or
unrelated code were touched.

## Post-fix test output

All 14 tests passed.

```
Test Files  2 passed (2)
     Tests  14 passed (14)
```

## Outcome

**Success**

## Human judgment

The agent inferred the exact UI string from the tests, implemented the count as
derived state rather than separate mutable state, kept it synchronized across
add, complete, delete, and clear-completed behavior, and avoided broad rewrites.

## Failure class

None

## Severity

None

## Decision

Ship

## Notes

This run tested requirement interpretation and derived state consistency. The
agent handled the strict UI expectation and preserved existing behavior. Future
runs should include a recovery trap, such as one misleading failing test or a
requirement that conflicts with the obvious implementation.
