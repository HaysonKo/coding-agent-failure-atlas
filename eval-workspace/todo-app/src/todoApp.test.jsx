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
