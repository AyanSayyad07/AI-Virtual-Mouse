import React, { useEffect, useState } from 'react';
import { User, Mail, ShieldCheck, Edit3, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../services/socketService';
import './Profile.css';

const Profile = ({ setIsCameraActive }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Developer',
    email: 'developer@example.com',
    role: 'Local User',
    joinDate: 'Just now',
    profilePicture: null
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse user session");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (setIsCameraActive) setIsCameraActive(false);
    socket.emit('toggle_camera', false);
    navigate('/');
  };

  return (
    <div className="profile-card card">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <div className="profile-avatar" style={{ overflow: 'hidden' }}>
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span className="avatar-initials">{user.name && user.name.trim() !== '' ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U'}</span>
            )}
          </div>
          <div className="profile-status-badge" title="Online"></div>
        </div>
        <div className="profile-actions">
          <button className="icon-btn" title="Edit Profile">
            <Edit3 size={18} />
          </button>
        </div>
      </div>

      <div className="profile-details">
        <h3 className="profile-name">{user.name}</h3>
        <p className="profile-role">
          <ShieldCheck size={14} className="role-icon" /> {user.role}
        </p>
      </div>

      <div className="profile-stats">
        <div className="stat-row">
          <div className="stat-label">
            <Mail size={16} /> Email
          </div>
          <div className="stat-value">{user.email}</div>
        </div>
        <div className="stat-row">
          <div className="stat-label">
            <User size={16} /> Member Since
          </div>
          <div className="stat-value">{user.joinDate}</div>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        style={{ marginTop: '1.5rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--border-radius-md)', fontWeight: '600', transition: 'all 0.2s', cursor: 'pointer' }}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <LogOut size={18} /> Log Out
      </button>
    </div>
  );
};

export default Profile;
