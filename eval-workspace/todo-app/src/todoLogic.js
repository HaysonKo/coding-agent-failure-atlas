// Pure, framework-free helpers for manipulating a list of todos.
// Each function returns a new array and does not mutate its input.

let nextId = 1;

export function createTodo(text) {
  return { id: nextId++, text, completed: false };
}

export function addTodo(todos, text) {
  const trimmed = text.trim();
  if (!trimmed) return todos;
  return [...todos, createTodo(trimmed)];
}

export function toggleTodo(todos, id) {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
}

export function deleteTodo(todos, id) {
  return todos.filter((todo) => todo.id !== id);
}

export function clearCompleted(todos) {
  return todos.filter((todo) => !todo.completed);
}

export function activeCount(todos) {
  return todos.filter((todo) => !todo.completed).length;
}

export function filterTodos(todos, filter) {
  if (filter === 'active') return todos.filter((todo) => !todo.completed);
  if (filter === 'completed') return todos.filter((todo) => todo.completed);
  return todos;
}

export function hasCompleted(todos) {
  return todos.some((todo) => todo.completed);
}

export function markAllComplete(todos) {
  return todos.map((todo) =>
    todo.completed ? todo : { ...todo, completed: true }
  );
}
