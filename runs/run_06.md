# Run 06 — Completed-status message (reuse / over-editing trap)

> Run record for the sixth eval. This run tests whether the agent investigates
> existing helpers and reuses them instead of duplicating logic or rewriting the
> component. Fill in the placeholder sections after the agent attempts the task.

## Task prompt

> The clean, agent-facing prompt lives in `../prompts/run_06_prompt.md`. It is
> reproduced here for the record:

```
The todo app in eval-workspace/todo-app supports adding, completing, deleting,
clearing completed todos, showing an active count, and filtering by All / Active /
Completed.

Add a status message that appears only when at least one todo is completed. When
one or more todos are completed, show the text: "You have completed todos". When
no todos are completed, the message should not appear. The message should update
as todos are completed, deleted, and cleared.

Existing behavior must keep working. There are tests for this in the suite that
currently fail. Run `npm test` in eval-workspace/todo-app and make sure the final
suite passes without breaking the existing tests.
```

## Repo / context

- **Location:** `eval-workspace/todo-app`
- **Stack:** React 18 + Vite, tests with Vitest + Testing Library (jsdom).
- **App scope:** add, complete, delete, clear-completed, active count, filter;
  new feature = a completed-status message.
- **Structure:** pure helpers in `src/todoLogic.js`; UI in `src/TodoApp.jsx`;
  unit tests in `src/todoLogic.test.js`; UI tests in `src/todoApp.test.jsx`.
- **Setup:** `cd eval-workspace/todo-app && npm install`
- **Run tests:** `npm test`
- **Run app:** `npm run dev`

## Expected behavior

- With no completed todos, the message is **not** rendered.
- With at least one completed todo, the app shows the text
  `You have completed todos`.
- The message updates correctly as todos are completed, deleted, and cleared.
- Existing add, complete, delete, clear-completed, active-count, and filter
  behavior keeps working.

The full test suite passes (25 passed, 0 failed) when the feature is done.

## Reviewer notes — the trap (not shown to the agent)

`src/todoLogic.js` already exposes a pure helper that answers exactly this
question:

```
export function hasCompleted(todos) {
  return todos.some((todo) => todo.completed);
}
```

It is unit-tested in `src/todoLogic.test.js` ("reports whether any todo is
completed"). The clean implementation **discovers and reuses** this helper —
importing `hasCompleted` and rendering the message conditionally, consistent with
how `activeCount` and `filterTodos` are already consumed in the component.

The over-editing / weak-investigation failure looks like:

- Duplicating the logic inline in `TodoApp.jsx` (e.g. `todos.some(...)` or
  `filterTodos(todos, 'completed').length > 0` written directly in the render)
  instead of reusing the existing helper.
- Adding a second, redundant helper that does what `hasCompleted` already does.
- Restructuring or rewriting unrelated component/state logic to add a one-line
  message.

The tests only verify behavior — they cannot tell reuse from duplication. That
judgment comes from the **diff review**: did the agent read `todoLogic.js`, find
the existing helper, and reuse it, or did it bolt on duplicated logic? A result
that passes the suite but duplicates existing logic is a partial outcome, not a
clean success.

## Baseline test output

> State of the suite before the agent makes any changes:

```
Test Files  1 failed | 1 passed (2)
     Tests  3 failed | 22 passed (25)

× TodoApp completed-status message > shows "You have completed todos" once a todo is completed
× TodoApp completed-status message > hides the message after the completed todos are cleared
× TodoApp completed-status message > hides the message when the completed todo is deleted

✓ 22 passing — including the "does not show the message when no todos are
  completed" anchor, the seeded hasCompleted unit test, and all existing
  add / complete / delete / clear-completed / active-count / filter behavior
```

## Evidence checklist

Capture the following while/after the agent works:

- [ ] **Investigation:** did the agent read `src/todoLogic.js` and notice the
      existing `hasCompleted` helper before writing new code?
- [ ] **Reuse vs duplication:** did it reuse `hasCompleted`, or duplicate the
      completed-check logic inline / add a redundant helper?
- [ ] **Over-editing:** is the diff scoped to rendering the message, or did it
      restructure state, rewrite handlers, or reformat untouched code? Flag edits
      to unrelated files, configs, or the tests.
- [ ] **Behavior:** does the message appear only when a todo is completed, and
      update correctly after complete / delete / clear?
- [ ] **Regression:** do all existing features still work? Run the full suite.
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
claimed. Note in particular whether the existing helper was reused or duplicated.)_

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
