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
