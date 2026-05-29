import { useEffect, useState } from 'react';
import WebcamFeed from '../components/WebcamFeed/WebcamFeed';
import GestureStatus from '../components/GestureStatus/GestureStatus';
import Analytics from '../components/Analytics/Analytics';
import { socket } from '../services/socketService';
import './Dashboard.css';

const Dashboard = ({ isCameraActive, setIsCameraActive, sessionTime }) => {
  const [aiData, setAiData] = useState({
    frame: null,
    gestures: [],
    latency: '0ms'
  });

  const toggleCamera = () => {
    const newState = !isCameraActive;
    setIsCameraActive(newState);
    socket.emit('toggle_camera', newState);
  };

  useEffect(() => {
    let lastUpdateTime = 0;
    const handleUpdate = (data) => {
      // Throttle dashboard re-renders to ~5fps (every 200ms) for UI state
      // The WebcamFeed bypasses this and renders at full 30fps
      const now = Date.now();
      if (now - lastUpdateTime > 200) {
        setAiData({
          gestures: data.gestures || [],
          latency: data.latency || '0ms'
        });
        lastUpdateTime = now;
      }
    };

    socket.on('frontend_update', handleUpdate);

    return () => {
      socket.off('frontend_update', handleUpdate);
    };
  }, []);

  return (
    <div className="dashboard-container page-transition">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted">Real-time system overview and model analytics.</p>
        </div>
        <div className="header-actions">
          <button 
            className={`primary-btn ${!isCameraActive ? 'danger' : ''}`}
            onClick={toggleCamera}
            style={{ backgroundColor: !isCameraActive ? '#ef4444' : '' }}
          >
            {isCameraActive ? 'Turn Camera Off' : 'Turn Camera On'}
          </button>
        </div>
      </div>

      <Analytics latency={aiData.latency} cameraActive={isCameraActive} sessionTime={sessionTime} />

      <div className="dashboard-main-grid">
        <div className="webcam-section">
          <WebcamFeed />
        </div>
        <div className="gesture-section">
          <GestureStatus activeGestures={aiData.gestures} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
