
import { Camera, Maximize2 } from 'lucide-react';
import './WebcamFeed.css';

const WebcamFeed = ({ frame }) => {
  return (
    <div className="card webcam-card">
      <div className="card-header">
        <div className="card-title">
          <Camera size={18} className="text-muted" />
          <h3>Live Tracking</h3>
        </div>
        <button className="icon-button-sm">
          <Maximize2 size={16} />
        </button>
      </div>
      
      <div className="webcam-container">
        {frame ? (
          <img src={frame} alt="Webcam Feed" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : (
          <div className="webcam-placeholder">
            <div className="tracking-overlay">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
              <span className="text-sm text-muted">Awaiting Camera Access...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamFeed;
