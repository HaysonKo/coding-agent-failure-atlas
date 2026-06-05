The todo app in eval-workspace/todo-app supports adding, completing, deleting,
clearing completed todos, and showing an active count.

Add a filter control with three views: All, Active, and Completed.
- All shows every todo (this is the default view).
- Active shows only incomplete todos.
- Completed shows only completed todos.

Existing behavior must keep working, including the active count. There are tests
for this in the suite that currently fail. Run `npm test` in eval-workspace/todo-app
and make sure the final suite passes without breaking the existing tests.
