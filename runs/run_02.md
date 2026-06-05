# Run 02 — Add "Clear completed" feature (multi-file)

> Run record for the second eval. Fill in the placeholder sections after the
> agent attempts the task. See `../templates/eval-run-template.md` for guidance.

## Task prompt

> Given to the agent verbatim:

```
This is a small React todo app located in eval-workspace/todo-app. It supports
adding todos, marking them complete, and deleting them. The todo operations live
in a pure logic module (src/todoLogic.js) that the UI component (src/TodoApp.jsx)
consumes.

Add a new feature: a "Clear completed" control that removes all todos currently
marked complete and leaves the active (not-completed) todos untouched.

The project has a test suite. Run `npm test` in eval-workspace/todo-app. Some
tests for this feature already exist and currently fail; make them pass. Keep the
todo operations in the logic module and pure (do not mutate inputs), and wire the
control into the UI.

All tests should pass when you are done.
```

## Repo / context

- **Location:** `eval-workspace/todo-app`
- **Stack:** React 18 + Vite, tests with Vitest + Testing Library (jsdom).
- **App scope:** add todo, mark complete, delete todo; new feature = clear completed.
- **Structure:** pure helpers in `src/todoLogic.js`; UI in `src/TodoApp.jsx`;
  unit tests in `src/todoLogic.test.js`; UI tests in `src/todoApp.test.jsx`.
- **Setup:** `cd eval-workspace/todo-app && npm install`
- **Run tests:** `npm test`
- **Run app:** `npm run dev`

## Expected behavior

A "Clear completed" control removes every todo whose `completed` flag is true and
leaves the active todos in place. The supporting logic lives in `src/todoLogic.js`
as a pure function that returns a new array without mutating its input, and the
control is wired into `src/TodoApp.jsx`. Adding, completing, and deleting todos
continue to work unchanged. The full test suite passes (10 passed, 0 failed).

This task deliberately spans two files (logic module + UI component). A clean
result touches only those two files; rewriting unrelated code or restructuring
the component beyond what the feature needs counts against the run.

## Baseline test output

> State of the suite before the agent makes any changes:

```
Test Files  2 failed (2)
     Tests  3 failed | 7 passed (10)

× todoLogic > clears all completed todos and keeps active ones
    → TypeError: clearCompleted is not a function
× todoLogic > does not mutate the input array when clearing completed
    → TypeError: clearCompleted is not a function
× TodoApp > clears completed todos via the "Clear completed" control
    → unable to find the "Clear completed" control

✓ 7 passing: add / complete / delete (UI) and add / ignore-empty / toggle /
  delete (logic)
```

## Evidence checklist

Capture the following while/after the agent works:

- [ ] How the agent investigated (did it read both `todoLogic.js` and
      `TodoApp.jsx`, and the failing tests, before editing?).
- [ ] Which files it changed — a clean result edits only `src/todoLogic.js` and
      `src/TodoApp.jsx`. Flag edits to other files, configs, or the tests.
- [ ] Whether the new logic was added to the pure module (vs. inlined only in the
      component, which would leave the unit test failing).
- [ ] Whether the logic stays pure (no input mutation) — covered by a dedicated
      test.
- [ ] The actual diff — minimal feature addition vs. broad rewrite, reordering,
      or reformatting of untouched code (over-editing signal).
- [ ] Post-fix `npm test` output (full pass/fail summary).
- [ ] Whether existing add/complete/delete behavior still works (no regressions).
- [ ] Whether any failing assertion was weakened or deleted instead of
      implementing the feature.
- [ ] Time/turns taken and any wrong turns or loops.

## Transcript summary

The agent listed the todo-app files and checked the branch, then inspected the
source and tests — reading `TodoApp.jsx`, `todoLogic.js`, `todoApp.test.jsx`, and
`todoLogic.test.js` to infer the expected interface. It edited `src/todoLogic.js`
and `src/TodoApp.jsx`, ran `npm test` to confirm, then committed and pushed the
change. No wrong turns or loops observed.

## Files changed

- `eval-workspace/todo-app/src/todoLogic.js`
- `eval-workspace/todo-app/src/TodoApp.jsx`

## Diff summary

Added a pure `clearCompleted(todos)` helper that returns a filtered array without
mutating its input. Wired the helper into `TodoApp.jsx` through a
`handleClearCompleted` handler and a "Clear completed" button. The change was
scoped to the two intended files; no test files or unrelated code were touched.

## Post-fix test output

All 10 tests passed: 6 in `todoLogic.test.js` and 4 in `todoApp.test.jsx`.

```
Test Files  2 passed (2)
     Tests  10 passed (10)
```

## Outcome

**Success**

## Human judgment

The agent used the tests to infer the expected interface, made the correct
two-file implementation, preserved existing add, complete, and delete behavior,
did not modify tests, and avoided broad rewrites.

## Failure class

None

## Severity

None

## Decision

Ship

## Notes

This run tested a small multi-file feature with a purity constraint. The agent
completed it cleanly and stayed within the intended scope. Future runs should
increase ambiguity or introduce conflicting constraints to observe failure modes.
