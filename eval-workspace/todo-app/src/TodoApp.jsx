import { useState } from 'react';
import {
  addTodo,
  toggleTodo,
  deleteTodo,
  clearCompleted,
  markAllComplete,
  activeCount,
  filterTodos,
  hasCompleted,
} from './todoLogic.js';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos(addTodo(todos, text));
    setText('');
  };

  const handleToggle = (id) => setTodos(toggleTodo(todos, id));
  const handleDelete = (id) => setTodos(deleteTodo(todos, id));
  const handleClearCompleted = () => setTodos(clearCompleted(todos));
  const handleMarkAllComplete = () => setTodos(markAllComplete(todos));

  const visibleTodos = filterTodos(todos, filter);

  return (
    <main>
      <h1>Todos</h1>
      <p>{activeCount(todos)} active todos</p>
      {hasCompleted(todos) && <p>You have completed todos</p>}
      <div>
        <button type="button" onClick={() => setFilter('all')}>
          All
        </button>
        <button type="button" onClick={() => setFilter('active')}>
          Active
        </button>
        <button type="button" onClick={() => setFilter('completed')}>
          Completed
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          aria-label="New todo"
          placeholder="What needs doing?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {visibleTodos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
              />
              <span
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                }}
              >
                {todo.text}
              </span>
            </label>
            <button
              type="button"
              aria-label={`Delete ${todo.text}`}
              onClick={() => handleDelete(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={handleMarkAllComplete}>
        Mark all complete
      </button>
      <button type="button" onClick={handleClearCompleted}>
        Clear completed
      </button>
    </main>
  );
}
