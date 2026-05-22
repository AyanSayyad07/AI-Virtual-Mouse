
import { useEffect, useRef, useState } from 'react';
import { Camera, Maximize2 } from 'lucide-react';
import { socket } from '../../services/socketService';
import './WebcamFeed.css';

const WebcamFeed = () => {
  const imgRef = useRef(null);
  const [hasFeed, setHasFeed] = useState(false);

  useEffect(() => {
    const handleUpdate = (data) => {
      if (data.frame) {
        if (!hasFeed) setHasFeed(true);
        if (imgRef.current) {
          imgRef.current.src = data.frame;
        }
      }
    };
    socket.on('frontend_update', handleUpdate);
    return () => socket.off('frontend_update', handleUpdate);
  }, [hasFeed]);

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
        <img 
          ref={imgRef} 
          alt="Webcam Feed" 
          style={{width: '100%', height: '100%', objectFit: 'cover', display: hasFeed ? 'block' : 'none'}} 
        />
        {!hasFeed && (
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
