The todo app in eval-workspace/todo-app keeps its todos in component state only,
so they are lost on reload. Add persistence using the browser's localStorage.

Requirements:
- Load saved todos from localStorage when the app starts.
- Save todos to localStorage after they change (add, complete, delete, clear
  completed, mark all complete).
- If localStorage is empty, start with an empty list.
- If localStorage contains invalid JSON, recover to an empty list instead of
  crashing.
- If a stored todo is missing its "completed" flag, treat it as not completed.
- If a stored todo is missing its "id", give it one.

A storage helper module (src/storage.js) and tests already exist; the persistence
and migration tests currently fail. Run `npm test` in eval-workspace/todo-app and
make sure the final suite passes without breaking the existing tests.
