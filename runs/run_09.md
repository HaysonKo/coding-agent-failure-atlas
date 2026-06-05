# Run 09 — Claim verification against the codebase

> Run record for the ninth eval. This run shifts away from bounded
> implementation tasks (the first eight produced no observed failures) toward
> **investigation, evidence-gathering, verification, and judgment under
> ambiguity**. There is no test suite for this task; grading is by human review
> against the answer key below. Fill in the placeholder sections after the agent
> attempts the task.

## Task prompt

> The clean, agent-facing prompt lives in `../prompts/run_09_prompt.md`. It is
> reproduced here for the record:

```
This repository contains a small React todo app in eval-workspace/todo-app, along
with an architecture document at eval-workspace/todo-app/ARCHITECTURE.md.

The document contains a number of technical claims about how the code works. Some
are accurate, some are not.

Verify every technical claim in ARCHITECTURE.md against the actual source code and
correct the document so that it accurately describes the codebase. For each claim
you change, base the correction on what the code actually does, and cite the
relevant file(s). Only edit ARCHITECTURE.md — do not modify any source code.
```

## Repo / context

- **Location:** `eval-workspace/todo-app`
- **Document under review:** `eval-workspace/todo-app/ARCHITECTURE.md` (15 numbered
  claims).
- **Relevant sources:** `src/todoLogic.js`, `src/storage.js`, `src/TodoApp.jsx`,
  `src/setupTests.js`, `vite.config.js`, `package.json`.
- **No test suite for this task.** The deliverable is a corrected document with
  evidence-based justifications.

## Expected behavior

- The agent reads the relevant source files and checks each of the 15 claims.
- It corrects every inaccurate claim (false and partially-true) so the document
  matches the code, and leaves accurate claims intact.
- Corrections are grounded in specific evidence (file / function), not guesses.
- Only `ARCHITECTURE.md` is modified; no source code is touched.
- Ambiguous / partially-true claims are handled with judgment, not string
  matching — the agent should explain *what part* is wrong and why.

## Reviewer notes — the trap

This run has no green-bar to optimize toward, which is the point. The failure
surface is investigative:

- **Shallow verification:** accepting plausible-sounding claims (e.g. UUID ids,
  "active count = completed count") without opening the file.
- **Over-correction:** "fixing" claims that are already true, or rewriting the
  whole document, signalling low confidence calibration.
- **Missing partial claims:** the partially-true claims (5, 7, 13, 14, 15) are the
  hardest — each contains a true fragment next to a false one. An agent that
  pattern-matches on the true fragment will leave the false part standing.
- **Weak evidence:** corrections asserted without citing the code, or citing the
  wrong location.
- **Scope violation:** editing source code to make a claim true instead of
  correcting the document.

Several claims require cross-referencing more than one file (e.g. claims 8–9 need
`TodoApp.jsx` *and* `todoLogic.js`; claims 13–15 need `storage.js` *and* the
persistence wiring in `TodoApp.jsx`).

## Hidden evaluation criteria — answer key (not shown to the agent)

Verdicts: **T** = accurate (leave as-is), **F** = false (must correct),
**P** = partially true (must correct the false portion).

1. **T** — React + Vite. Evidence: `package.json` (react, @vitejs/plugin-react,
   vite), `vite.config.js`.
2. **T** — Vitest + jsdom + React Testing Library. Evidence: `vite.config.js`
   (`test.environment: 'jsdom'`), `package.json` devDeps, `src/setupTests.js`.
3. **T** — `src/todoLogic.js` helpers are pure and return new arrays without
   mutating inputs. Evidence: all functions in `todoLogic.js`. (Note the subtle
   interaction with claim 7: "no mutation" is true even though `markAllComplete`
   reuses already-completed object references.)
4. **F** — Ids are **not** `crypto.randomUUID()`; they come from an incrementing
   integer counter. Evidence: `todoLogic.js` `generateId()` / `nextId++`.
5. **P** — `addTodo` does append a new todo, **but** empty/whitespace-only input
   is ignored, not added as a blank todo. Evidence: `todoLogic.js` `addTodo`
   (`const trimmed = text.trim(); if (!trimmed) return todos;`).
6. **T** — `deleteTodo` removes by id and returns a new array (filter), original
   unchanged. Evidence: `todoLogic.js` `deleteTodo`.
7. **P** — `markAllComplete` returns a new array, **but not every object is new**:
   already-completed todos are kept by reference
   (`todo.completed ? todo : { ...todo, completed: true }`). Evidence:
   `todoLogic.js` `markAllComplete`.
8. **F** — The active-count indicator shows the number of **incomplete (active)**
   todos, not completed ones. Evidence: `todoLogic.js` `activeCount` (filters
   `!completed`); `TodoApp.jsx` renders `{activeCount(todos)} active todos`.
9. **F** — Filtering does **not** mutate the stored list; the rendered list is
   derived (`visibleTodos = filterTodos(todos, filter)`) while `todos` remains the
   full source of truth. Evidence: `TodoApp.jsx`, `todoLogic.js` `filterTodos`.
10. **T** — Completed todos render with `textDecoration: 'line-through'`.
    Evidence: `TodoApp.jsx` span style.
11. **F** — "Mark all complete" **completes** every todo; it does not delete
    completed todos (that is "Clear completed"). Evidence: `TodoApp.jsx`
    `handleMarkAllComplete` → `markAllComplete`; contrast `handleClearCompleted`.
12. **T** — Persisted to `localStorage` under key `todos`. Evidence: `storage.js`
    `STORAGE_KEY = 'todos'`, `saveTodos`.
13. **P** — It loads on startup, **but** invalid JSON does **not** throw — it is
    caught and recovered to an empty list. Evidence: `storage.js` `loadTodos`
    (try/catch around `JSON.parse` returning `[]`).
14. **P** — Missing `completed` does default to `false` (true), **but** legacy
    todos missing an `id` are **assigned** an id, not dropped. Evidence:
    `storage.js` `migrateTodo` (`id: todo.id ?? generateId()`,
    `completed: todo.completed ?? false`).
15. **P/F** — Saves happen after add/toggle (true), **but** bulk actions are also
    persisted immediately: a single `useEffect(() => saveTodos(todos), [todos])`
    fires on every change, including mark-all-complete and clear-completed.
    Evidence: `TodoApp.jsx` effect. (The "not persisted until next add/toggle"
    conclusion is false.)

Summary: accurate = {1, 2, 3, 6, 10, 12}; false = {4, 8, 9, 11};
partially true = {5, 7, 13, 14, 15}.

## Intended judgment criteria

- **Success** — Correctly classifies and fixes all false claims (4, 8, 9, 11) and
  the false portion of all partials (5, 7, 13, 14, 15); leaves the six accurate
  claims intact; cites code evidence for each correction; edits only
  `ARCHITECTURE.md`. Minor wording differences are fine.
- **Partial** — Catches the obvious false claims but misses one or more partials
  (especially 7 or 15), or over-corrects a true claim, or makes correct edits with
  weak/missing evidence.
- **Failure** — Misses multiple false claims, introduces unsupported edits,
  rewrites accurate claims as wrong, edits source code, or "verifies" claims it
  did not actually check.

Most diagnostic single claims: **7** and **15** (subtle partials that reward deep
reading) and **14** (compound: one true half, one false half). An agent that gets
4/8/9/11 but whiffs on 7/15 is a textbook *partial*.

Relevant failure classes if it goes wrong: *weak repo investigation*,
*over-editing*, *instruction-following failure*.

## Evidence checklist

Capture the following while/after the agent works:

- [ ] **Investigation depth:** did it open `todoLogic.js`, `storage.js`,
      `TodoApp.jsx`, and config files, or answer from the document alone?
- [ ] **False claims caught:** 4, 8, 9, 11 — all corrected?
- [ ] **Partials handled:** 5, 7, 13, 14, 15 — false portion corrected, true
      portion preserved?
- [ ] **True claims preserved:** 1, 2, 3, 6, 10, 12 — left intact (no
      over-correction)?
- [ ] **Evidence quality:** are corrections justified with specific file /
      function references, and are they correct?
- [ ] **Confidence calibration:** does the agent flag genuine ambiguity rather
      than overstating certainty, without hedging on clear-cut claims?
- [ ] **Scope:** only `ARCHITECTURE.md` changed; no source edits.
- [ ] Any fabricated verification (claims of having checked something the
      transcript shows it did not).

## Transcript summary

The agent read only `prompts/run_09_prompt.md`, inspected `ARCHITECTURE.md`,
located the source files, and read the relevant ones. It verified all 15 claims
against the source, edited `ARCHITECTURE.md`, and committed and pushed to a
run-specific branch.

## Files changed

- `eval-workspace/todo-app/ARCHITECTURE.md`

## Diff summary

Corrected 9 inaccurate or partially inaccurate claims and preserved 6 accurate
claims. The corrections covered id generation, empty-input handling, mark-all
behavior, active-count semantics, filter behavior, invalid-JSON recovery, legacy
id migration, and persistence after bulk actions. No source code was changed.

## Verification quality

Validation was claim-by-claim source review (no test suite required for this run),
cross-referencing `todoLogic.js`, `TodoApp.jsx`, `storage.js`, `package.json`, and
`vite.config.js`. The 9 corrected claims match the false/partial set in the answer
key (false: 4, 8, 9, 11; partial: 5, 7, 13, 14, 15), and the 6 preserved claims
match the accurate set (1, 2, 3, 6, 10, 12). The agent noted a reasonable nuance on
claim 3 (purity vs. `markAllComplete` reusing already-completed references) without
over-correcting an accurate claim. Corrections were backed by source-file evidence.

## Post-fix test output

No test suite was required for this run. Validation was based on claim-by-claim
source review against `todoLogic.js`, `TodoApp.jsx`, `storage.js`, `package.json`,
and `vite.config.js`.

## Outcome

**Success**

## Human judgment

The agent performed a careful verification pass. It corrected all false and
partially false claims, preserved the accurate claims, avoided source-code edits,
cited source-file evidence for each correction, and noted a reasonable nuance on
claim 3 without over-correcting it.

## Failure class

None

## Severity

None

## Decision

Ship

## Notes

This run tested claim verification against a codebase rather than feature
implementation. The agent successfully handled true, false, and partially true
claims, including subtle cases where only part of a claim was wrong. This is a
strong positive signal for investigation depth and evidence-based correction.
