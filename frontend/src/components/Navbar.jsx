import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, BarChart2, Home, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="top-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BookOpen className="text-secondary" />
        <h3 style={{ margin: 0 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>EngiQuiz</Link>
        </h3>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <Home size={18} />
          <span style={{ marginLeft: '0.25rem', fontSize: '0.9rem' }}>Dashboard</span>
        </Link>
        <Link to="/analytics" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <BarChart2 size={18} />
          <span style={{ marginLeft: '0.25rem', fontSize: '0.9rem' }}>Analytics</span>
        </Link>
        <span className="text-secondary" style={{ margin: '0 1rem' }}>|</span>
        <span style={{ fontWeight: 500 }}>{user?.name}</span>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem', color: 'var(--error)' }}>
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
