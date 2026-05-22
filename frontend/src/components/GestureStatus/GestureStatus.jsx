
import { Hand, MousePointer2, Move, Type, ZoomIn } from 'lucide-react';
import './GestureStatus.css';

const GestureStatus = ({ activeGestures = [] }) => {
  const gestures = [
    { id: 'pinch', name: 'Quick Click', icon: MousePointer2, active: activeGestures.includes('pinch'), key: 'Quick Pinch' },
    { id: 'drag', name: 'Drag & Drop', icon: Hand, active: activeGestures.includes('drag'), key: 'Hold Pinch' },
    { id: 'two_hands', name: 'Dynamic Zoom', icon: ZoomIn, active: activeGestures.includes('two_hands'), key: 'Dual Pinch & Pull' },
    { id: 'swipe', name: 'Scroll', icon: Move, active: activeGestures.includes('swipe'), key: 'Two Fingers' },
    { id: 'keyboard', name: 'Virtual Keyboard', icon: Type, active: activeGestures.includes('keyboard'), key: 'Three Fingers' },
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
