import { useState, useCallback } from 'react';
import { createAccount, validateAccount } from '../models/account.js';

// Domain hook for managing a working set of accounts in component state.
export function useAccount(initial = []) {
  const [accounts, setAccounts] = useState(initial);

  const addAccount = useCallback((data) => {
    const candidate = { role: 'member', ...data };
    const errors = validateAccount(candidate);
    if (errors.length > 0) return errors;
    setAccounts((prev) => [...prev, createAccount(candidate)]);
    return [];
  }, []);

  const removeAccount = useCallback((id) => {
    setAccounts((prev) => prev.filter((account) => account.id !== id));
  }, []);

  return { accounts, addAccount, removeAccount };
}
