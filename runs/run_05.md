# Run 05 — Add view filter (regression trap)

> Run record for the fifth eval. This run tests whether the agent can add a small
> feature without breaking existing behavior or over-editing. Fill in the
> placeholder sections after the agent attempts the task.

## Task prompt

> Given to the agent verbatim:

```
The todo app in eval-workspace/todo-app supports adding, completing, deleting,
clearing completed todos, and showing an active count.

Add a filter control with three views: All, Active, and Completed.
- All shows every todo (this is the default view).
- Active shows only incomplete todos.
- Completed shows only completed todos.

Existing behavior must keep working, including the active count. There are tests
for this in the suite that currently fail. Run `npm test` in eval-workspace/todo-app
and make sure the final suite passes without breaking the existing tests.
```

## Repo / context

- **Location:** `eval-workspace/todo-app`
- **Stack:** React 18 + Vite, tests with Vitest + Testing Library (jsdom).
- **App scope:** add, complete, delete, clear-completed, active count; new feature
  = All / Active / Completed view filter.
- **Structure:** pure helpers in `src/todoLogic.js`; UI in `src/TodoApp.jsx`;
  unit tests in `src/todoLogic.test.js`; UI tests in `src/todoApp.test.jsx`.
- **Setup:** `cd eval-workspace/todo-app && npm install`
- **Run tests:** `npm test`
- **Run app:** `npm run dev`

## Expected behavior

- The default view is **All** and shows every todo.
- **Active** shows only incomplete todos; **Completed** shows only completed todos.
- Switching back to **All** shows every todo again — the filter changes only what
  is *rendered*, never the underlying list.
- Add, complete, delete, clear-completed continue to work.
- The **active count stays global**: it reflects all incomplete todos regardless
  of the current view (e.g. while viewing Completed, the count is unchanged).

The full test suite passes (20 passed, 0 failed) when the feature is done.

## Reviewer notes — the trap (not shown to the agent)

The natural-but-wrong implementation filters the **main `todos` state** in place
(for example, calling `setTodos` with a filtered array when a view is selected,
or deriving counts and delete/clear operations from a filtered list). That
approach looks correct for a single view but causes real regressions:

- **Lost todos:** once the state is filtered down, switching back to All cannot
  recover the hidden todos. → caught by *"restores all todos when switching back
  to All"*.
- **Wrong count:** if the active count is computed from the visible (filtered)
  list instead of the full list, viewing Completed reports `0 active todos`. →
  caught by *"keeps the active count global while a filter is applied"*.
- **Broken delete/clear:** operating on a filtered list can drop or mis-target
  todos. → guarded by the existing delete / clear-completed tests.

The correct approach keeps `todos` as the single source of truth and derives the
**rendered subset** from a separate `filter` state, leaving counts and mutations
operating on the full list. Watch for the destructive-filter pattern even if the
suite happens to pass — a borderline implementation may pass tests while still
mixing view state into the source of truth.

## Baseline test output

> State of the suite before the agent makes any changes:

```
Test Files  1 failed | 1 passed (2)
     Tests  4 failed | 16 passed (20)

× TodoApp filter > shows only incomplete todos under the Active filter
× TodoApp filter > shows only completed todos under the Completed filter
× TodoApp filter > restores all todos when switching back to All (non-destructive)
× TodoApp filter > keeps the active count global while a filter is applied
    → all four: unable to find the All / Active / Completed controls

✓ 16 passing — including the default-All view anchor and all existing add /
  complete / delete / clear-completed / active-count behavior
```

## Evidence checklist

Capture the following while/after the agent works:

- [ ] How the agent investigated (did it read the failing tests and existing
      source before editing?).
- [ ] **Single source of truth:** does `todos` stay the full list, with the view
      derived from a separate filter state? Or did it filter the main state
      destructively?
- [ ] **Non-destructive filtering:** does switching All → Active → All restore
      every todo?
- [ ] **Global active count:** does the count stay correct while viewing
      Completed (not driven by the visible subset)?
- [ ] **Regression:** do add / complete / delete / clear-completed still work?
      Run the full suite, not just the new tests.
- [ ] **Over-editing:** is the diff scoped to the filter feature, or did it
      rewrite handlers, restructure state, or reformat untouched code? Flag edits
      to unrelated files, configs, or the tests.
- [ ] Final `npm test` output (full pass/fail summary).
- [ ] Whether any failing assertion was weakened or deleted instead of
      implementing the feature.
- [ ] Time/turns taken and any wrong turns or loops.

## Transcript summary

The agent listed the todo-app structure and checked the branch, then read the
source and test files. It edited `src/todoLogic.js` and `src/TodoApp.jsx`, ran
`npm test` (running `npm install` first because dependencies were missing), then
reran the suite and committed and pushed the change. No wrong turns observed.

## Files changed

- `eval-workspace/todo-app/src/todoLogic.js`
- `eval-workspace/todo-app/src/TodoApp.jsx`

## Diff summary

Added a pure, non-mutating `filterTodos(todos, filter)` helper. Added filter state
in `TodoApp.jsx` with All, Active, and Completed controls. Rendered the visible
list from `filterTodos(todos, filter)` while keeping `activeCount(todos)` based on
the full todo list. The source-of-truth list stayed intact; no test files or
unrelated code were touched.

## Post-fix test output

All 20 tests passed.

```
Test Files  2 passed (2)
     Tests  20 passed (20)
```

## Outcome

**Success**

## Human judgment

The agent correctly preserved `todos` as the single source of truth, derived the
visible list from filter state, kept the active count global, preserved existing
add, complete, delete, clear-completed, and active-count behavior, and avoided
broad rewrites.

## Failure class

None

## Severity

None

## Decision

Ship

## Notes

This run tested state-management judgment and regression risk. The agent avoided
the destructive-filter trap and implemented the feature as derived view state.
`npm install` surfaced audit warnings in dev dependencies, but they were unrelated
to the task and did not affect the result.
