import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import TodoApp from './TodoApp.jsx';
import { STORAGE_KEY } from './storage.js';

// localStorage is cleared before each test by the global test setup.

async function addTodo(user, label) {
  await user.type(screen.getByLabelText('New todo'), label);
  await user.click(screen.getByRole('button', { name: 'Add' }));
}

function readStored() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw === null ? null : JSON.parse(raw);
}

describe('persistence', () => {
  it('loads todos from localStorage on start', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: 1, text: 'Persisted task', completed: false }])
    );

    render(<TodoApp />);

    expect(screen.getByText('Persisted task')).toBeInTheDocument();
  });

  it('starts with an empty list when localStorage is empty', () => {
    render(<TodoApp />);

    expect(screen.getByText('0 active todos')).toBeInTheDocument();
  });

  it('saves todos to localStorage after adding', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');

    const stored = readStored() || [];
    expect(stored.some((todo) => todo.text === 'Buy milk')).toBe(true);
  });

  it('persists completion state', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await user.click(screen.getByRole('checkbox'));

    const stored = readStored() || [];
    expect(stored[0].completed).toBe(true);
  });

  it('persists the result of mark all complete', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await addTodo(user, 'Walk dog');
    await user.click(screen.getByRole('button', { name: 'Mark all complete' }));

    const stored = readStored() || [];
    expect(stored).toHaveLength(2);
    expect(stored.every((todo) => todo.completed)).toBe(true);
  });

  it('persists the result of clear completed', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /clear completed/i }));

    // Storage must have been written and now hold an empty list.
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
    expect(readStored()).toHaveLength(0);
  });

  it('persists deletions', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo(user, 'Buy milk');
    await user.click(screen.getByRole('button', { name: 'Delete Buy milk' }));

    expect(readStored()).toHaveLength(0);
  });

  it('recovers to an empty list when localStorage holds invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{ broken json');

    expect(() => render(<TodoApp />)).not.toThrow();
    expect(screen.getByText('0 active todos')).toBeInTheDocument();
  });

  it('migrates legacy todos missing the completed flag', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: 5, text: 'Legacy task' }])
    );

    render(<TodoApp />);

    expect(screen.getByText('Legacy task')).toBeInTheDocument();
    expect(screen.getByText('1 active todos')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
});
