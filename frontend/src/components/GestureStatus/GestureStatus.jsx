
import { MousePointer2, Move, ZoomIn, Volume2, Volume1, Play, SkipForward } from 'lucide-react';
import './GestureStatus.css';

const GestureStatus = ({ activeGestures = [] }) => {
  const gestures = [
    { id: 'pinch', name: 'Click / Right Click', icon: MousePointer2, active: activeGestures.includes('pinch'), key: 'Pinch' },
    { id: 'swipe', name: 'Scroll', icon: Move, active: activeGestures.includes('swipe'), key: 'Two Fingers' },
    { id: 'two_hands', name: 'Zoom', icon: ZoomIn, active: activeGestures.includes('two_hands'), key: 'Dual Pinch' },
    { id: 'thumbs_up', name: 'Volume Up', icon: Volume2, active: activeGestures.includes('thumbs_up'), key: 'Thumbs Up' },
    { id: 'thumbs_down', name: 'Volume Down', icon: Volume1, active: activeGestures.includes('thumbs_down'), key: 'Thumbs Down' },
    { id: 'pinky_up', name: 'Play / Pause', icon: Play, active: activeGestures.includes('pinky_up'), key: 'Pinky Up' },
    { id: 'rock_sign', name: 'Next Track', icon: SkipForward, active: activeGestures.includes('rock_sign'), key: 'Rock Sign' },
  ];

  return (
    <div className="card gesture-card">
      <div className="card-header">
        <h3>Active Gestures</h3>
      </div>
      
      <div className="gesture-list">
        {gestures.map((gesture) => (
          <div key={gesture.id} className={`gesture-item ${gesture.active ? 'active' : ''}`}>
            <div className="gesture-icon-wrapper">
              <gesture.icon size={20} className="gesture-icon" />
            </div>
            <div className="gesture-info">
              <span className="gesture-name">{gesture.name}</span>
              <span className="text-sm text-muted">{gesture.key}</span>
            </div>
            <div className="status-indicator-dot"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestureStatus;
