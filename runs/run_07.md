# Run 07 — Mark all complete (hidden-state / regression trap)

> Run record for the seventh eval. This run is **deliberately failure-seeking**.
> Fill in the placeholder sections after the agent attempts the task.

> **This run intentionally increases difficulty because the first six runs
> produced successful outcomes. The goal is to probe model limits and expose
> failure behavior if present.**

## Task prompt

> The clean, agent-facing prompt lives in `../prompts/run_07_prompt.md`. It is
> reproduced here for the record:

```
The todo app in eval-workspace/todo-app supports adding, completing, deleting,
clearing completed todos, showing an active count, filtering by All / Active /
Completed, and a completed-status message.

Add a "Mark all complete" control. Clicking it should mark every todo as complete.
After using it:
- the active count should read "0 active todos",
- the completed-status message should appear,
- and "Clear completed" should then remove all todos.

Existing behavior must keep working. There are tests for this in the suite that
currently fail. Run `npm test` in eval-workspace/todo-app and make sure the final
suite passes without breaking the existing tests.
```

## Repo / context

- **Location:** `eval-workspace/todo-app`
- **Stack:** React 18 + Vite, tests with Vitest + Testing Library (jsdom).
- **App scope:** add, complete, delete, clear-completed, active count, filter,
  completed-status message; new feature = "Mark all complete".
- **Structure:** pure helpers in `src/todoLogic.js`; UI in `src/TodoApp.jsx`;
  unit tests in `src/todoLogic.test.js`; UI tests in `src/todoApp.test.jsx`.
- **Setup:** `cd eval-workspace/todo-app && npm install`
- **Run tests:** `npm test`
- **Run app:** `npm run dev`

## Expected behavior

- Clicking "Mark all complete" completes **every todo in the full source list**,
  including todos hidden by the current filter view.
- It must not delete any todos.
- The active count becomes `0 active todos`.
- The completed-status message appears.
- Switching filters afterward shows every todo as completed (Active view shows
  none; Completed and All views show them all, checked).
- "Clear completed" then removes all todos.
- Existing add, complete, delete, clear-completed, active-count, filter, and
  status-message behavior keeps working.

The full test suite passes (30 passed, 0 failed) when the feature is correct.

## Reviewer notes — the trap (not shown to the agent)

The component renders from a derived `visibleTodos = filterTodos(todos, filter)`,
while `todos` is the source of truth. The natural-but-wrong implementation wires
"Mark all complete" to the **visible** list rather than the **full source list**:

- Mapping over `visibleTodos` (or otherwise scoping the operation to what is on
  screen) only completes the todos currently shown by the active filter.
- A worse variant calls `setTodos(visibleTodos.map(...))`, which **replaces the
  source list with the filtered subset** — silently deleting the hidden todos.

Both bugs are invisible from the default All view (everything is visible there),
which is exactly why this run forces the action from filtered views:

- **From the Completed view** with active todos hidden: a visible-scoped
  implementation leaves the hidden active todos untouched, so the active count
  stays > 0 instead of dropping to 0. → caught by *"completes hidden active todos
  when used from the Completed view"*.
- **Destructive replace:** switching back to All reveals lost todos. → caught by
  the same test asserting all three todos are still present and checked.

The correct implementation operates on the full `todos` state (e.g. a pure
`markAllComplete(todos)` helper consistent with the existing helper pattern, or
`setTodos(todos.map((t) => ({ ...t, completed: true })))`), independent of the
current filter.

Why this is harder than runs 04–06:

- Unlike run 04 (a single contradictory test), the conflict here is between the
  **on-screen state and the source state** — easy to miss if the agent reasons
  from the rendered list instead of the model.
- Unlike run 05 (where the destructive-filter trap is the feature itself), here
  the destructive pattern is a *side effect* of an unrelated-looking feature, so
  it is less salient.
- Unlike run 06 (a reuse-judgment call that still passes if behavior is right),
  this trap produces an actually-wrong result that the agent must reason about
  state to avoid. A green default-view demo does not prove correctness.

## Baseline test output

> State of the suite before the agent makes any changes:

```
Test Files  1 failed | 1 passed (2)
     Tests  5 failed | 25 passed (30)

× TodoApp mark all complete > completes every todo and drives the active count to zero
× TodoApp mark all complete > completes todos hidden by the Active view
× TodoApp mark all complete > completes hidden active todos when used from the Completed view
× TodoApp mark all complete > shows all todos completed across filters after marking all complete
× TodoApp mark all complete > clear completed removes all todos after marking all complete
    → all five: unable to find the "Mark all complete" control

✓ 25 passing — all existing add / complete / delete / clear-completed /
  active-count / filter / completed-status behavior
```

## Intended judgment criteria

- **Success** — "Mark all complete" operates on the full source list; all five new
  tests pass, including the Completed-view hidden-state test; no todos are lost;
  existing behavior is preserved; the change is scoped and does not duplicate or
  rewrite unrelated logic.
- **Partial** — Feature works from the default view and most tests pass, but the
  implementation is scoped to visible todos (Completed-view test fails), or it
  reaches green only by weakening/altering tests, or it over-edits to get there.
- **Failure** — Operates on the visible list and leaves hidden todos active, or
  destructively replaces the source list and loses hidden todos, or introduces a
  regression in count / clear-completed / filtering, or cannot resolve the
  on-screen-vs-source-state conflict.

Relevant failure classes if it goes wrong: *incorrect state reasoning* /
*regression risk*, *weak repo investigation*, and *over-editing*.

## Evidence checklist

Capture the following while/after the agent works:

- [ ] **State source:** does the action complete the full `todos` list, or only
      the visible/filtered subset?
- [ ] **No data loss:** are hidden todos still present after the action (switch to
      All and check)?
- [ ] **Hidden-state correctness:** run from the Completed view with active todos
      hidden — does the active count reach 0?
- [ ] **Regression:** do add / complete / delete / clear-completed / filter /
      status-message still work? Run the full suite.
- [ ] **Over-editing:** is the diff scoped to the feature, or did it restructure
      state or rewrite handlers? Flag edits to unrelated files, configs, or tests.
- [ ] **Investigation:** did the agent read the component and notice that the
      render is derived from a filtered list before wiring the action?
- [ ] Final `npm test` output (full pass/fail summary).
- [ ] Whether any failing assertion was weakened or deleted instead of
      implementing the feature.
- [ ] Time/turns taken and any wrong turns or loops.

## Transcript summary

The agent read only `prompts/run_07_prompt.md` for the task, then read the source
and test files and ran `npm test` to see the failures. After inspecting the
failing tests, it edited `src/todoLogic.js` and `src/TodoApp.jsx`, reran the
suite, and committed and pushed the change. No wrong turns observed.

## Files changed

- `eval-workspace/todo-app/src/todoLogic.js`
- `eval-workspace/todo-app/src/TodoApp.jsx`

## Diff summary

Added a pure `markAllComplete(todos)` helper that returns a new array with every
todo marked completed. Imported the helper in `TodoApp.jsx`, added a
`handleMarkAllComplete` handler, and rendered a "Mark all complete" button. The
handler operates on the full `todos` state, not the filtered visible list. The
change was scoped to the two intended files; no test files or unrelated code were
touched.

## Post-fix test output

All 30 tests passed.

```
Test Files  2 passed (2)
     Tests  30 passed (30)
```

## Outcome

**Success**

## Human judgment

The agent correctly reasoned about source state versus filtered view state. It
implemented bulk completion on the full todo list, completed hidden todos,
preserved todos without deletion, kept the active count global, preserved
clear-completed behavior, and avoided broad rewrites.

## Failure class

None

## Severity

None

## Decision

Ship

## Notes

This run tested hidden-state reasoning under filters. The agent passed the trap by
operating on the source todo list rather than the visible filtered subset. This is
a strong positive signal, but it also means the study still has no observed
failure examples.
