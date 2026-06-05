import { useState } from 'react';

let nextId = 1;

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos([...todos, { id: nextId++, text: trimmed, completed: false }]);
    setText('');
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    // Remove the todo whose id matches the one that was clicked.
    setTodos(todos.filter((todo) => todo.id === id));
  };

  return (
    <main>
      <h1>Todos</h1>
      <form onSubmit={addTodo}>
        <input
          aria-label="New todo"
          placeholder="What needs doing?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
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
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
