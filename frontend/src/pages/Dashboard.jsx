import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Bonjour, {user?.fullName} 👋</h1>

      <button onClick={handleLogout}>
        Se déconnecter
      </button>
    </div>
  );
}
