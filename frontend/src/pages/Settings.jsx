import { useState, useEffect } from 'react';
import { socket } from '../services/socketService';
import { Save } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [gestureMap, setGestureMap] = useState({
    thumbs_up: 'volumeup',
    thumbs_down: 'volumedown',
    pinky_up: 'playpause',
    rock_sign: 'nexttrack'
  });
  
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('gestureRules');
    if (saved) {
      setGestureMap(JSON.parse(saved));
    }
  }, []);

  const handleChange = (gesture, action) => {
    setGestureMap(prev => ({ ...prev, [gesture]: action }));
  };

  const handleSave = () => {
    localStorage.setItem('gestureRules', JSON.stringify(gestureMap));
    socket.emit('update_gesture_rules', gestureMap);
    setSaveStatus('Saved successfully!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  return (
    <div className="settings-page">
      <h2>Custom Gesture Engine</h2>
      <p className="settings-desc">Map physical hand gestures to operating system commands. These rules will be applied in real-time to the AI engine.</p>
      
      <div className="settings-grid">
        <div className="setting-card">
          <div className="setting-header">
            <h3>👍 Thumbs Up</h3>
            <p>Thumb extended, other fingers closed</p>
          </div>
          <select 
            value={gestureMap.thumbs_up} 
            onChange={(e) => handleChange('thumbs_up', e.target.value)}
          >
            <option value="none">None</option>
            <option value="volumeup">Volume Up</option>
            <option value="volumedown">Volume Down</option>
            <option value="playpause">Play / Pause</option>
            <option value="nexttrack">Next Track</option>
          </select>
        </div>

        <div className="setting-card">
          <div className="setting-header">
            <h3>👎 Thumbs Down</h3>
            <p>Thumb extended downwards</p>
          </div>
          <select 
            value={gestureMap.thumbs_down} 
            onChange={(e) => handleChange('thumbs_down', e.target.value)}
          >
            <option value="none">None</option>
            <option value="volumeup">Volume Up</option>
            <option value="volumedown">Volume Down</option>
            <option value="playpause">Play / Pause</option>
            <option value="nexttrack">Next Track</option>
          </select>
        </div>

        <div className="setting-card">
          <div className="setting-header">
            <h3>🤙 Pinky Up</h3>
            <p>Pinky extended, other fingers closed</p>
          </div>
          <select 
            value={gestureMap.pinky_up} 
            onChange={(e) => handleChange('pinky_up', e.target.value)}
          >
            <option value="none">None</option>
            <option value="volumeup">Volume Up</option>
            <option value="volumedown">Volume Down</option>
            <option value="playpause">Play / Pause</option>
            <option value="nexttrack">Next Track</option>
          </select>
        </div>

        <div className="setting-card">
          <div className="setting-header">
            <h3>🤘 Rock Sign</h3>
            <p>Index & Pinky extended</p>
          </div>
          <select 
            value={gestureMap.rock_sign} 
            onChange={(e) => handleChange('rock_sign', e.target.value)}
          >
            <option value="none">None</option>
            <option value="volumeup">Volume Up</option>
            <option value="volumedown">Volume Down</option>
            <option value="playpause">Play / Pause</option>
            <option value="nexttrack">Next Track</option>
          </select>
        </div>
      </div>

      <div className="settings-footer">
        <button className="save-btn" onClick={handleSave}>
          <Save size={18} /> Save Rules
        </button>
        {saveStatus && <span className="save-status">{saveStatus}</span>}
      </div>
    </div>
  );
};

export default Settings;
