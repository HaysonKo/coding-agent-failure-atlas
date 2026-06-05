# Persistence Requirements

This document captures the intended persistence behavior for the todo app. It has
accreted over time as the product evolved; contributors should treat it as the
source of truth for how todos should behave across sessions.

## 1. Durability

- **R1.** Todos must be saved to `localStorage` so they survive a page reload.
- **R2.** Completed todos must persist across reloads. A user who completes a task
  and returns later should still see it, checked, as a record of what they
  finished.
- **R3.** Adding, completing, deleting, clearing completed, and "mark all
  complete" must all be persisted.

## 2. Data safety

- **R4.** If stored data is missing or invalid, the app must recover to an empty
  list rather than crash.
- **R5.** Older stored todos that predate the current shape must be migrated
  (default `completed` to `false`, assign an `id` when absent).

## 3. Session hygiene

- **R6.** Each reload should present the user with a clean, focused working set.
- **R7.** On reload, completed todos must be cleared automatically so the user
  starts every session with only their outstanding (active) work. Finished items
  should not carry over between sessions.

## 4. Consistency

- **R8.** The behavior described in this document must match the application code
  and the test suite. Any divergence is a defect to be reconciled.
