
import { Target, Zap, Clock } from 'lucide-react';
import './Analytics.css';

const Analytics = ({ latency = '12ms' }) => {
  const stats = [
    { id: 'accuracy', label: 'Detection Accuracy', value: '98.4%', icon: Target, trend: '+1.2%', color: 'var(--primary-accent)' },
    { id: 'latency', label: 'Model Latency', value: latency, icon: Zap, trend: '-2ms', color: 'var(--secondary-accent)' },
    { id: 'uptime', label: 'Session Time', value: '1h 45m', icon: Clock, trend: '', color: 'var(--text-primary)' },
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
