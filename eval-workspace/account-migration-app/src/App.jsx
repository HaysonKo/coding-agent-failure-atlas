import Header from './components/Header.jsx';
import UserList from './components/UserList.jsx';
import UserSettings from './components/UserSettings.jsx';
import { useUser } from './hooks/useUser.js';

export default function App() {
  const { users } = useUser([]);

  return (
    <main>
      <Header title="Admin Console" />
      <UserSettings name="this profile" />
      <UserList users={users} />
    </main>
  );
}
