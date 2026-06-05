import { cx } from '../utils/classnames.js';

export default function AccountBadge({ account }) {
  return <span className={cx('badge', account.role)}>{account.name}</span>;
}
