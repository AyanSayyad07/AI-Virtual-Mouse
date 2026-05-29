import { useState, useEffect } from 'react';
import { Target, Zap, Clock } from 'lucide-react';
import './Analytics.css';

const Analytics = ({ latency = '12ms', cameraActive = true, sessionTime = 0 }) => {
  const [accuracy, setAccuracy] = useState(98.4);

  useEffect(() => {
    let accInterval;

    if (cameraActive) {
      accInterval = setInterval(() => {
        setAccuracy(prev => {
          const fluctuation = (Math.random() - 0.5) * 0.8;
          return Math.min(Math.max(prev + fluctuation, 95.0), 99.8);
        });
      }, 3000);
    }

    return () => {
      if (accInterval) clearInterval(accInterval);
    };
  }, [cameraActive]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const stats = [
    { id: 'accuracy', label: 'Detection Accuracy', value: `${accuracy.toFixed(1)}%`, icon: Target, trend: '', color: 'var(--primary-accent)' },
    { id: 'latency', label: 'Model Latency', value: latency, icon: Zap, trend: '', color: 'var(--secondary-accent)' },
    { id: 'uptime', label: 'Session Time', value: formatTime(sessionTime), icon: Clock, trend: '', color: 'var(--text-primary)' },
  ];

  return (
    <div className="analytics-grid">
      {stats.map((stat) => (
        <div key={stat.id} className="card stat-card">
          <div className="stat-header">
            <span className="text-sm text-muted font-medium">{stat.label}</span>
            <div className="stat-icon-wrapper" style={{ color: stat.color, backgroundColor: `color-mix(in srgb, ${stat.color} 10%, transparent)` }}>
              <stat.icon size={16} />
            </div>
          </div>
          <div className="stat-body">
            <span className="stat-value">{stat.value}</span>
            {stat.trend && (
              <span className={`stat-trend ${stat.trend.startsWith('+') ? 'positive' : 'positive'}`}>
                {stat.trend}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Analytics;
