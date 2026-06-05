The todo app in eval-workspace/todo-app supports adding, completing, deleting,
clearing completed todos, showing an active count, and filtering by All / Active /
Completed.

Add a status message that appears only when at least one todo is completed. When
one or more todos are completed, show the text: "You have completed todos". When
no todos are completed, the message should not appear. The message should update
as todos are completed, deleted, and cleared.

Existing behavior must keep working. There are tests for this in the suite that
currently fail. Run `npm test` in eval-workspace/todo-app and make sure the final
suite passes without breaking the existing tests.
