import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import TodoApp from './TodoApp.jsx';

async function addTodo(user, label) {
  await user.type(screen.getByLabelText('New todo'), label);
  await user.click(screen.getByRole('button', { name: 'Add' }));
}

describe('TodoApp', () => {
  it('adds a todo to the list', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });

  it('marks a todo as complete', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('deletes only the selected todo', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');
    await addTodo(user, 'Write code');

    await user.click(screen.getByRole('button', { name: 'Delete Walk dog' }));

    // The clicked todo should be gone, the others should remain.
    expect(screen.queryByText('Walk dog')).not.toBeInTheDocument();
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Write code')).toBeInTheDocument();
  });

  it('clears completed todos via the "Clear completed" control', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');

    // Mark the first todo complete, leave the second active.
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    await user.click(screen.getByRole('button', { name: /clear completed/i }));

    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
    expect(screen.getByText('Walk dog')).toBeInTheDocument();
  });
});

describe('TodoApp active count', () => {
  it('shows "0 active todos" for an empty list', () => {
    render(<TodoApp />);

    expect(screen.getByText('0 active todos')).toBeInTheDocument();
  });

  it('counts only the incomplete todos', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');
    expect(screen.getByText('2 active todos')).toBeInTheDocument();

    // Completing a todo should drop it out of the active count.
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    expect(screen.getByText('1 active todos')).toBeInTheDocument();
  });

  it('decreases the count when an active todo is deleted', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');

    await user.click(screen.getByRole('button', { name: 'Delete Walk dog' }));

    expect(screen.getByText('1 active todos')).toBeInTheDocument();
  });

  it('keeps the active count correct after clearing completed', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');

    // Complete the first, leaving one active todo.
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    await user.click(screen.getByRole('button', { name: /clear completed/i }));

    expect(screen.getByText('1 active todos')).toBeInTheDocument();
  });

  it('excludes completed todos from the active count', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');

    // Complete one of the two todos.
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(screen.getByText('1 active todos')).toBeInTheDocument();
  });
});

describe('TodoApp filter', () => {
  it('defaults to showing all todos', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');

    // Complete one; with the default (All) view both should still be visible.
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Walk dog')).toBeInTheDocument();
  });

  it('shows only incomplete todos under the Active filter', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');
    await addTodo(user, 'Write code');

    // Complete the first todo, then switch to the Active view.
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(screen.getByRole('button', { name: 'Active' }));

    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
    expect(screen.getByText('Walk dog')).toBeInTheDocument();
    expect(screen.getByText('Write code')).toBeInTheDocument();
  });

  it('shows only completed todos under the Completed filter', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');
    await addTodo(user, 'Write code');

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(screen.getByRole('button', { name: 'Completed' }));

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.queryByText('Walk dog')).not.toBeInTheDocument();
    expect(screen.queryByText('Write code')).not.toBeInTheDocument();
  });

  it('restores all todos when switching back to All (filtering is non-destructive)', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');
    await addTodo(user, 'Write code');

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    await user.click(screen.getByRole('button', { name: 'Active' }));
    await user.click(screen.getByRole('button', { name: 'All' }));

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Walk dog')).toBeInTheDocument();
    expect(screen.getByText('Write code')).toBeInTheDocument();
  });

  it('keeps the active count global while a filter is applied', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');

    // Complete one todo: one active remains.
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    // Viewing only completed todos must not change the global active count.
    await user.click(screen.getByRole('button', { name: 'Completed' }));

    expect(screen.getByText('1 active todos')).toBeInTheDocument();
  });
});

describe('TodoApp completed-status message', () => {
  it('does not show the message when no todos are completed', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');

    expect(
      screen.queryByText('You have completed todos')
    ).not.toBeInTheDocument();
  });

  it('shows "You have completed todos" once a todo is completed', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(screen.getByText('You have completed todos')).toBeInTheDocument();
  });

  it('hides the message after the completed todos are cleared', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    expect(screen.getByText('You have completed todos')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear completed/i }));

    expect(
      screen.queryByText('You have completed todos')
    ).not.toBeInTheDocument();
  });

  it('hides the message when the completed todo is deleted', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(screen.getByText('You have completed todos')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete Buy milk' }));

    expect(
      screen.queryByText('You have completed todos')
    ).not.toBeInTheDocument();
  });
});

describe('TodoApp mark all complete', () => {
  it('completes every todo and drives the active count to zero', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');

    await user.click(screen.getByRole('button', { name: 'Mark all complete' }));

    expect(screen.getByText('0 active todos')).toBeInTheDocument();
    expect(screen.getByText('You have completed todos')).toBeInTheDocument();

    // Nothing was deleted; every visible checkbox is checked.
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Walk dog')).toBeInTheDocument();
    screen
      .getAllByRole('checkbox')
      .forEach((checkbox) => expect(checkbox).toBeChecked());
  });

  it('completes todos hidden by the Active view', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');
    await addTodo(user, 'Write code');

    // Complete the first todo, then view only the active ones (the completed
    // todo is now hidden from view but still in the list).
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(screen.getByRole('button', { name: 'Active' }));

    await user.click(screen.getByRole('button', { name: 'Mark all complete' }));

    expect(screen.getByText('0 active todos')).toBeInTheDocument();

    // Back on All, all three todos remain and are completed.
    await user.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Walk dog')).toBeInTheDocument();
    expect(screen.getByText('Write code')).toBeInTheDocument();
    screen
      .getAllByRole('checkbox')
      .forEach((checkbox) => expect(checkbox).toBeChecked());
  });

  it('completes hidden active todos when used from the Completed view', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');
    await addTodo(user, 'Write code');

    // Complete one todo, then view only completed todos. Two active todos are
    // now hidden from view but must still be affected by "Mark all complete".
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(screen.getByRole('button', { name: 'Completed' }));

    await user.click(screen.getByRole('button', { name: 'Mark all complete' }));

    // Global active count reflects the full list, not just the visible subset.
    expect(screen.getByText('0 active todos')).toBeInTheDocument();

    // Back on All, every todo is still present and completed — none lost.
    await user.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Walk dog')).toBeInTheDocument();
    expect(screen.getByText('Write code')).toBeInTheDocument();
    screen
      .getAllByRole('checkbox')
      .forEach((checkbox) => expect(checkbox).toBeChecked());
  });

  it('shows all todos completed across filters after marking all complete', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');

    await user.click(screen.getByRole('button', { name: 'Mark all complete' }));

    // Active view now shows nothing.
    await user.click(screen.getByRole('button', { name: 'Active' }));
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
    expect(screen.queryByText('Walk dog')).not.toBeInTheDocument();

    // Completed view shows both.
    await user.click(screen.getByRole('button', { name: 'Completed' }));
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Walk dog')).toBeInTheDocument();
  });

  it('clear completed removes all todos after marking all complete', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');
    await addTodo(user, 'Write code');

    await user.click(screen.getByRole('button', { name: 'Mark all complete' }));
    await user.click(screen.getByRole('button', { name: /clear completed/i }));

    expect(screen.getByText('0 active todos')).toBeInTheDocument();
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
    expect(screen.queryByText('Walk dog')).not.toBeInTheDocument();
    expect(screen.queryByText('Write code')).not.toBeInTheDocument();
    expect(
      screen.queryByText('You have completed todos')
    ).not.toBeInTheDocument();
  });
});
