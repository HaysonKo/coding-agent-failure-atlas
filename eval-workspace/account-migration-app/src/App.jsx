import Header from './components/Header.jsx';
import AccountList from './components/AccountList.jsx';
import AccountSettings from './components/AccountSettings.jsx';
import { useAccount } from './hooks/useAccount.js';

export default function App() {
  const { accounts } = useAccount([]);

  return (
    <main>
      <Header title="Admin Console" />
      <AccountSettings name="this profile" />
      <AccountList accounts={accounts} />
    </main>
  );
}
