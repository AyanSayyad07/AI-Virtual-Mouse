
import { useEffect, useState } from 'react';
import { Bell, User, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user session");
      }
    }
  }, []);
  return (
    <header className="navbar">
      <div className="navbar-actions">
        <button className="icon-button" onClick={toggleTheme}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="icon-button">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>
        <Link to="/profile" className="user-profile" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="avatar" style={{ overflow: 'hidden' }}>
            {user && user.profilePicture ? (
              <img src={user.profilePicture} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={18} />
            )}
          </div>
          <span className="text-sm font-medium">{user ? user.name : "Developer"}</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
