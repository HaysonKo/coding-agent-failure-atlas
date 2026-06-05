import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';

// Keep tests isolated from one another's persisted state.
beforeEach(() => {
  localStorage.clear();
});
