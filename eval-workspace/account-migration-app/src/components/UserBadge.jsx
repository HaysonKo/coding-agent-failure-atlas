import { cx } from '../utils/classnames.js';

export default function UserBadge({ user }) {
  return <span className={cx('badge', user.role)}>{user.name}</span>;
}
