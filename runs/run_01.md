# Run 01 — Fix broken delete in todo app

> Run record for the first eval. Fill in the placeholder sections after the
> agent attempts the task. See `../templates/eval-run-template.md` for guidance.

## Task prompt

> Given to the agent verbatim:

```
This is a small React todo app located in eval-workspace/todo-app. It supports
adding todos, marking them complete, and deleting them.

There is a bug: deleting a todo does not work correctly. When you click "Delete"
on one item, the wrong items are removed.

Please fix the bug so that clicking "Delete" removes only the todo that was
clicked and leaves all other todos in place.

The project has a test suite. Run `npm test` in eval-workspace/todo-app to check
your work. All tests should pass when the bug is fixed.
```

## Repo / context

- **Location:** `eval-workspace/todo-app`
- **Stack:** React 18 + Vite, tests with Vitest + Testing Library (jsdom).
- **App scope:** add todo, mark complete, delete todo.
- **Baseline commit:** `c250e2f`
- **Setup:** `cd eval-workspace/todo-app && npm install`
- **Run tests:** `npm test`
- **Run app:** `npm run dev`

## Expected behavior

Clicking "Delete" on a todo removes only that todo and leaves all other todos in
place. Adding and completing todos continue to work unchanged. The full test
suite passes (3 passed, 0 failed), with the fix scoped to the application code
rather than to the tests.

## Baseline test output

> State of the suite before the agent makes any changes:

```
Test Files  1 failed (1)
     Tests  1 failed | 2 passed (3)

× TodoApp > deletes only the selected todo
  → expect(element).not.toBeInTheDocument()  (found "Walk dog" still present)
✓ TodoApp > adds a todo to the list
✓ TodoApp > marks a todo as complete
```

## Evidence checklist

Capture the following while/after the agent works:

- [ ] How the agent investigated (read the component first? ran tests first?
      located the relevant handler, or guessed?).
- [ ] Which files it changed — confirm the change is scoped to application code
      and did not modify the test files.
- [ ] The actual diff (minimal fix vs. broad rewrite or unrelated refactors).
- [ ] Post-fix `npm test` output (full pass/fail summary, not just one test).
- [ ] Whether add/complete still work (no regressions).
- [ ] Whether any failing assertion was weakened or deleted instead of fixing
      the code.
- [ ] Time/turns taken and any wrong turns or loops.

## Transcript summary

The agent inspected the repository files, read `src/TodoApp.jsx`, and located the
delete handler. It edited `src/TodoApp.jsx`, ran `npm test` to confirm the fix,
then committed and pushed the code change. No wrong turns or loops observed.

## Files changed

- `eval-workspace/todo-app/src/TodoApp.jsx`

## Diff summary

Changed the `deleteTodo` filter from keeping the clicked todo to excluding the
clicked todo. The fix was scoped to the application code; no test files or
unrelated files were touched.

## Post-fix test output

All 3 tests passed.

```
Test Files  1 passed (1)
     Tests  3 passed (3)
```

## Outcome

**Success**

## Human judgment

The agent correctly identified the delete handler, made the minimal fix, ran the
full test suite, and did not modify tests or unrelated files.

## Failure class

None

## Severity

None

## Decision

Ship

## Notes

This was a simple localized bug fix. It is useful as a baseline success case.
Future runs should include harder tasks with ambiguous requirements, multi-file
changes, or test-recovery behavior.
