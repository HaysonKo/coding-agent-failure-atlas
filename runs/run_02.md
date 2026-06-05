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
