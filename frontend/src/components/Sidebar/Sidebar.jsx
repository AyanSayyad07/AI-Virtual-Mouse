
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Settings, Info, Activity, LayoutDashboard, LogOut } from 'lucide-react';
import { socket } from '../../services/socketService';
import './Sidebar.css';

const Sidebar = ({ isCameraActive }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    socket.emit('toggle_camera', false);
    navigate('/');
  };

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Activity size={24} color="var(--primary-accent)" />
        </div>
        <h2>Virtual Mouse</h2>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
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
        <button 
          onClick={handleLogout} 
          className="nav-item" 
          style={{ marginTop: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left' }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="status-indicator">
          <span className={`dot ${isConnected ? (isCameraActive ? 'active' : 'inactive') : 'inactive'}`}></span>
          <span className="text-sm text-muted">
            {!isConnected ? 'Server Disconnected' : (isCameraActive ? 'AI Engine Connected' : 'AI Engine is Off')}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
