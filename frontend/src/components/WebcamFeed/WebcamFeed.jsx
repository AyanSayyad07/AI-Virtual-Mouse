
import { useEffect, useRef, useState } from 'react';
import { Camera, Maximize2, Minimize2 } from 'lucide-react';
import { socket } from '../../services/socketService';
import './WebcamFeed.css';

const WebcamFeed = () => {
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [hasFeed, setHasFeed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(console.error);
    } else {
      document.exitFullscreen?.();
    }
  };

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
    <div className="card webcam-card" ref={containerRef} style={isFullscreen ? { padding: 0, border: 'none', borderRadius: 0, backgroundColor: '#000' } : {}}>
      <div className="card-header" style={isFullscreen ? { position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 } : {}}>
        {!isFullscreen && (
          <div className="card-title">
            <Camera size={18} className="text-muted" />
            <h3>Live Tracking</h3>
          </div>
        )}
        <button className="icon-button-sm" onClick={toggleFullscreen} style={isFullscreen ? { color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '8px' } : {}}>
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={16} />}
        </button>
      </div>
      
      <div className="webcam-container" style={isFullscreen ? { border: 'none', borderRadius: 0 } : {}}>
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
