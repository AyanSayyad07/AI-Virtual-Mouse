import React, { useState } from 'react';
import Profile from '../components/Profile/Profile';
import { Bell, Shield, Key } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = ({ setIsCameraActive }) => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordUpdate = () => {
    setIsUpdatingPassword(true);
    setTimeout(() => {
      alert("A password reset link has been sent to your email!");
      setIsUpdatingPassword(false);
    }, 800);
  };
  return (
    <div className="profile-page-container page-transition">
      <div className="profile-page-header">
        <h1>My Profile</h1>
        <p className="text-muted">Manage your personal information and preferences.</p>
      </div>

      <div className="profile-page-grid">
        {/* Left Column: The Profile Card */}
        <div className="profile-sidebar">
          <Profile setIsCameraActive={setIsCameraActive} />
        </div>

        {/* Right Column: Expanded Settings/Info */}
        <div className="profile-main-content">
          
          <div className="card profile-section-card">
            <div className="section-header">
              <Bell size={20} className="section-icon" />
              <h3>Notifications</h3>
            </div>
            <div className="section-body">
              <div className="preference-item">
                <div className="pref-info">
                  <h4>Email Alerts</h4>
                  <p className="text-sm text-muted">Receive updates about new features.</p>
                </div>
                <div 
                  className={`toggle-switch ${emailAlerts ? 'active' : ''}`} 
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  style={{ cursor: 'pointer' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="card profile-section-card">
            <div className="section-header">
              <Shield size={20} className="section-icon" />
              <h3>Security</h3>
            </div>
            <div className="section-body">
              <div className="preference-item">
                <div className="pref-info">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Key size={14}/> Change Password
                  </h4>
                  <p className="text-sm text-muted">Update your current password.</p>
                </div>
                <button 
                  className="secondary-btn" 
                  onClick={handlePasswordUpdate}
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? "Sending..." : "Update"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
