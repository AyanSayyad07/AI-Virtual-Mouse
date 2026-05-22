import { useEffect, useState } from 'react';
import WebcamFeed from '../components/WebcamFeed/WebcamFeed';
import GestureStatus from '../components/GestureStatus/GestureStatus';
import Analytics from '../components/Analytics/Analytics';
import { socket, connectSocket, disconnectSocket } from '../services/socketService';
import './Dashboard.css';

const Dashboard = () => {
  const [aiData, setAiData] = useState({
    frame: null,
    gestures: [],
    latency: '0ms'
  });

  useEffect(() => {
    connectSocket();

    const handleUpdate = (data) => {
      setAiData(data);
    };

    socket.on('frontend_update', handleUpdate);

    return () => {
      socket.off('frontend_update', handleUpdate);
      disconnectSocket();
    };
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted">Real-time system overview and model analytics.</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn">
            Configure Model
          </button>
        </div>
      </div>

      <Analytics latency={aiData.latency} />

      <div className="dashboard-main-grid">
        <div className="webcam-section">
          <WebcamFeed frame={aiData.frame} />
        </div>
        <div className="gesture-section">
          <GestureStatus activeGestures={aiData.gestures} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
