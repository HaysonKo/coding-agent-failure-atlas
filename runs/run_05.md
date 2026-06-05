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

_(Placeholder — condensed account of the agent's session: investigation, plan,
key decisions, and how it handled errors.)_

## Files changed

_(Placeholder — list of files created, modified, or deleted.)_

## Diff summary

_(Placeholder — what actually changed in the code, independent of what the agent
claimed. Note in particular whether the source-of-truth list stays intact.)_

## Post-fix test output

_(Placeholder — paste the full `npm test` summary after the agent's changes.)_

## Outcome

_(Placeholder — one of: **success** / **partial** / **failure**.)_

## Human judgment

_(Placeholder — reviewer's rationale, drawing on all evidence above.)_

## Failure class

_(Placeholder — one or more categories from `../findings/failure-taxonomy.md`,
or "none" for a clean success.)_

## Severity

_(Placeholder — trivial / minor / moderate / major / critical.)_

## Decision

_(Placeholder — accept / revise / re-run / discard, etc.)_

## Notes

_(Placeholder — anything else worth recording for future review.)_
