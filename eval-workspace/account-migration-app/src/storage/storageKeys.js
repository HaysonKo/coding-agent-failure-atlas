// Legacy storage key retained for backward compatibility. Existing installs have
// data persisted under this key; renaming it would orphan that data on upgrade.
export const RECORDS_KEY = 'app.users.v1';
