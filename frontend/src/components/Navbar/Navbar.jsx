
import { Bell, Search, User, Sun, Moon } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ isDarkMode, toggleTheme }) => {
  return (
    <header className="navbar">
      <div className="navbar-search">
        <Search size={18} className="text-muted" />
        <input type="text" placeholder="Search commands or settings..." />
      </div>

      <div className="navbar-actions">
        <button className="icon-button" onClick={toggleTheme}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="icon-button">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>
        <div className="user-profile">
          <div className="avatar">
            <User size={18} />
          </div>
          <span className="text-sm font-medium">Developer</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
