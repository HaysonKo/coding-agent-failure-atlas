import { describe, it, expect } from 'vitest';
import {
  addTodo,
  toggleTodo,
  deleteTodo,
  clearCompleted,
} from './todoLogic.js';

describe('todoLogic', () => {
  it('adds a trimmed todo', () => {
    const todos = addTodo([], '  Buy milk  ');
    expect(todos).toHaveLength(1);
    expect(todos[0]).toMatchObject({ text: 'Buy milk', completed: false });
  });

  it('ignores empty input', () => {
    expect(addTodo([], '   ')).toHaveLength(0);
  });

  it('toggles completion of the given todo', () => {
    const todos = addTodo([], 'Buy milk');
    const toggled = toggleTodo(todos, todos[0].id);
    expect(toggled[0].completed).toBe(true);
  });

  it('deletes only the given todo', () => {
    const todos = addTodo(addTodo([], 'a'), 'b');
    const remaining = deleteTodo(todos, todos[0].id);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].text).toBe('b');
  });

  it('clears all completed todos and keeps active ones', () => {
    let todos = addTodo(addTodo(addTodo([], 'a'), 'b'), 'c');
    todos = toggleTodo(todos, todos[0].id);
    todos = toggleTodo(todos, todos[2].id);

    const result = clearCompleted(todos);

    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('b');
  });

  it('does not mutate the input array when clearing completed', () => {
    let todos = addTodo(addTodo([], 'a'), 'b');
    todos = toggleTodo(todos, todos[0].id);
    const before = todos.length;

    clearCompleted(todos);

    expect(todos).toHaveLength(before);
  });
});
