import UserBadge from './UserBadge.jsx';

export default function UserList({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <UserBadge user={user} />
        </li>
      ))}
    </ul>
  );
}
