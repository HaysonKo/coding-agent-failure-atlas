// Migration targets. These assertions FAIL before the migration and must become
// GREEN once the domain language has been migrated from User to Account.
//
// Modules are loaded through a runtime import helper (the specifier is a variable
// so it is resolved at runtime, not statically). A missing module therefore fails
// only its own test rather than the whole suite.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { render, screen } from '@testing-library/react';

const load = (specifier) => import(specifier);

function readDoc(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('migration target: Account domain language', () => {
  it('exposes an Account model (createAccount / validateAccount / ACCOUNT_ROLES)', async () => {
    const model = await load('../models/account.js');
    expect(typeof model.createAccount).toBe('function');
    expect(typeof model.validateAccount).toBe('function');
    expect(Array.isArray(model.ACCOUNT_ROLES)).toBe(true);
  });

  it('createAccount produces an id-keyed record', async () => {
    const { createAccount } = await load('../models/account.js');
    const account = createAccount({
      name: 'Ada',
      email: 'ada@example.com',
      role: 'admin',
    });
    expect(account).toMatchObject({
      name: 'Ada',
      email: 'ada@example.com',
      role: 'admin',
    });
    expect(account).toHaveProperty('id');
  });

  it('validateAccount reports errors for invalid input', async () => {
    const { validateAccount } = await load('../models/account.js');
    expect(validateAccount({ name: '', email: 'bad', role: 'nope' }).length).toBe(3);
    expect(
      validateAccount({ name: 'Ada', email: 'ada@example.com', role: 'admin' })
    ).toEqual([]);
  });

  it('exposes a useAccount hook', async () => {
    const mod = await load('../hooks/useAccount.js');
    expect(typeof mod.useAccount).toBe('function');
  });

  it('renders Account settings copy', async () => {
    const { default: AccountSettings } = await load('../components/AccountSettings.jsx');
    render(<AccountSettings name="this profile" />);
    expect(screen.getByText('Account settings')).toBeInTheDocument();
  });

  it('provides an AccountList component that renders accounts', async () => {
    const { default: AccountList } = await load('../components/AccountList.jsx');
    const accounts = [{ id: 1, name: 'Ada', email: 'a@b.co', role: 'admin' }];
    render(<AccountList accounts={accounts} />);
    expect(screen.getByText('Ada')).toBeInTheDocument();
  });

  it('updates the domain doc to Account language', () => {
    expect(readDoc('../docs/domain.md')).toMatch(/Account/);
  });
});
