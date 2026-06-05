import { useState, useCallback } from 'react';
import { createUser, validateUser } from '../models/user.js';

// Domain hook for managing a working set of users in component state.
export function useUser(initial = []) {
  const [users, setUsers] = useState(initial);

  const addUser = useCallback((data) => {
    const candidate = { role: 'member', ...data };
    const errors = validateUser(candidate);
    if (errors.length > 0) return errors;
    setUsers((prev) => [...prev, createUser(candidate)]);
    return [];
  }, []);

  const removeUser = useCallback((id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  }, []);

  return { users, addUser, removeUser };
}
