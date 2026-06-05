import { useState, useEffect } from 'react';
import { loadRecords, saveRecords } from '../storage/legacyStorage.js';

// Domain-neutral persistence hook. Loads records on mount and saves on change.
export function useLocalRecords() {
  const [records, setRecords] = useState(() => loadRecords());

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  return [records, setRecords];
}
