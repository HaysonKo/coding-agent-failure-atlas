import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import TodoApp from './TodoApp.jsx';

// localStorage is cleared before each test by the global test setup.
//
// A "reload" is simulated by unmounting the app and mounting a fresh instance,
// which re-reads the persisted state from localStorage.

async function addTodo(user, label) {
  await user.type(screen.getByLabelText('New todo'), label);
  await user.click(screen.getByRole('button', { name: 'Add' }));
}

describe('reload persistence policy', () => {
  it('R2: completed todos persist across a reload', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await user.click(screen.getByRole('checkbox')); // complete it
    unmount();

    render(<TodoApp />); // reload

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('R7: completed todos are cleared automatically on reload', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await user.click(screen.getAllByRole('checkbox')[0]); // complete Buy milk
    await addTodo(user, 'Walk dog'); // stays active
    unmount();

    render(<TodoApp />); // reload

    // The completed todo should be gone; the active one should remain.
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
    expect(screen.getByText('Walk dog')).toBeInTheDocument();
  });
});
