import AccountBadge from './AccountBadge.jsx';

export default function AccountList({ accounts }) {
  return (
    <ul>
      {accounts.map((account) => (
        <li key={account.id}>
          <AccountBadge account={account} />
        </li>
      ))}
    </ul>
  );
}
