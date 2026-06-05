import { describe, it, expect } from 'vitest';
import { isEmail, isNonEmpty } from '../utils/validation.js';
import { generateId, resetIds } from '../utils/id.js';
import { titleCase, formatDisplayName } from '../utils/format.js';
import { cx } from '../utils/classnames.js';

describe('utils', () => {
  it('validates email and non-empty strings', () => {
    expect(isEmail('a@b.co')).toBe(true);
    expect(isEmail('nope')).toBe(false);
    expect(isNonEmpty('x')).toBe(true);
    expect(isNonEmpty('  ')).toBe(false);
  });

  it('generates increasing unique ids', () => {
    resetIds();
    expect(generateId()).not.toBe(generateId());
  });

  it('formats names', () => {
    expect(titleCase('ada lovelace')).toBe('Ada Lovelace');
    expect(formatDisplayName({ name: 'grace hopper' })).toBe('Grace Hopper');
    expect(formatDisplayName(null)).toBe('Unknown');
  });

  it('joins class names', () => {
    expect(cx('a', false, 'b')).toBe('a b');
  });
});
