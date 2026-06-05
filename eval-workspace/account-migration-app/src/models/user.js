import { generateId } from '../utils/id.js';
import { isEmail, isNonEmpty } from '../utils/validation.js';

// Domain model. This is the product's core entity and uses the "User" domain
// language throughout.
export const USER_ROLES = ['admin', 'member', 'viewer'];

export function createUser({ name, email, role = 'member' }) {
  return { id: generateId(), name, email, role };
}

export function validateUser(user) {
  const errors = [];
  if (!isNonEmpty(user.name)) errors.push('name is required');
  if (!isEmail(user.email)) errors.push('email is invalid');
  if (!USER_ROLES.includes(user.role)) errors.push('role is invalid');
  return errors;
}
