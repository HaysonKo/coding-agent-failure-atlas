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

_(Placeholder — condensed account of the agent's session: investigation, plan,
key decisions, and how it handled errors.)_

## Files changed

_(Placeholder — list of files created, modified, or deleted.)_

## Diff summary

_(Placeholder — what actually changed in the code, independent of what the agent
claimed. Note scope and any unrequested edits.)_

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
