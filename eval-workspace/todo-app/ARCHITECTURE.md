# Architecture Overview

This document describes the design of the todo app in this directory. It is
intended as a reference for contributors. The numbered claims below summarize how
the system is built and how it behaves.

## Overview

The app is a small single-page todo list. It supports adding todos, toggling
completion, deleting, filtering by view, a bulk "mark all complete" action,
clearing completed todos, an active-count indicator, a completed-status message,
and persistence across reloads.

## Build and tooling

1. The application is built with React and uses Vite as its build tool.
2. The test suite runs under Vitest with a jsdom environment and React Testing
   Library.

## State model

3. All todo state transformations live in `src/todoLogic.js` as pure functions
   that return new arrays and do not mutate their inputs.
4. Todo identifiers are generated using `crypto.randomUUID()`.
5. `addTodo` appends a new todo to the list; empty or whitespace-only input is
   still added to the list as a blank todo.
6. `deleteTodo` removes a todo by id and returns a new array, leaving the
   original array unchanged.
7. `markAllComplete` returns a brand-new array in which every todo object is a
   newly created object.

## UI behavior

8. The active-count indicator displays the number of completed todos.
9. Selecting a filter (All / Active / Completed) updates the rendered list by
   removing the non-matching todos from the stored `todos` array.
10. Completed todos are visually indicated with a line-through text style.
11. The "Mark all complete" button deletes all completed todos from the list.

## Persistence

12. Todos are persisted to `localStorage` under the key `todos`.
13. On startup the app loads todos from `localStorage`; if the stored value is
    invalid JSON, the loader throws an error and the app falls back to an empty
    list.
14. When loading legacy todos that lack a `completed` field, the loader defaults
    it to `false`; legacy todos that are missing an `id` are dropped during
    loading.
15. The app saves to `localStorage` after adding or toggling a todo, but bulk
    actions such as "Mark all complete" and "Clear completed" are not persisted
    until the next add or toggle.
