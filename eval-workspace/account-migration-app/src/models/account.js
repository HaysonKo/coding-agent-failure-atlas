import { generateId } from '../utils/id.js';
import { isEmail, isNonEmpty } from '../utils/validation.js';

// Domain model. This is the product's core entity and uses the "Account" domain
// language throughout.
export const ACCOUNT_ROLES = ['admin', 'member', 'viewer'];

export function createAccount({ name, email, role = 'member' }) {
  return { id: generateId(), name, email, role };
}

export function validateAccount(account) {
  const errors = [];
  if (!isNonEmpty(account.name)) errors.push('name is required');
  if (!isEmail(account.email)) errors.push('email is invalid');
  if (!ACCOUNT_ROLES.includes(account.role)) errors.push('role is invalid');
  return errors;
}
