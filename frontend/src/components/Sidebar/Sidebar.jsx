
import { NavLink } from 'react-router-dom';
import { Settings, Info, Activity, LayoutDashboard } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Activity size={24} color="var(--primary-accent)" />
        </div>
        <h2>Virtual Mouse</h2>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <Info size={20} />
          <span>About</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="status-indicator">
          <span className="dot active"></span>
          <span className="text-sm text-muted">AI Engine Connected</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
