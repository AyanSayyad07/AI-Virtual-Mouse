import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, MousePointer2, ShieldCheck, Zap, Maximize, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container page-transition">
      {/* Reusing the background blobs from Auth pages */}
      <div className="auth-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <nav className="home-nav">
        <div className="home-logo">
          <Activity size={28} color="var(--primary-accent)" />
          <span className="logo-text">AI Virtual Mouse</span>
        </div>
        <div className="home-nav-links">
          <Link to="/login" className="home-login-btn">Log In</Link>
          <Link to="/register" className="home-register-btn">Sign Up</Link>
        </div>
      </nav>

      <main className="home-main">
        <section className="hero-section">
          <div className="hero-badge">Next Generation Control</div>
          <h1 className="hero-title">Control your world with just a wave.</h1>
          <p className="hero-subtitle">
            Experience the future of human-computer interaction. Our AI-powered virtual mouse uses your webcam to translate hand gestures into fluid, precise cursor movements.
          </p>
          <div className="hero-cta-group">
            <Link to="/login" className="hero-primary-btn">
              Let's Get Started <ArrowRight size={20} />
            </Link>
            <a href="#features" className="hero-secondary-btn">Explore Features</a>
          </div>
        </section>

        <section id="features" className="features-section">
          <div className="features-header">
            <h2>Everything you need, nothing you don't.</h2>
            <p className="text-muted">A powerful suite of tools designed for seamless spatial computing.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon-wrapper">
                <MousePointer2 size={24} className="feature-icon" />
              </div>
              <h3>Precision Tracking</h3>
              <p className="text-muted">High-fidelity index finger tracking ensures your cursor goes exactly where you want it, with sub-millimeter precision.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon-wrapper">
                <Zap size={24} className="feature-icon" />
              </div>
              <h3>Zero Latency</h3>
              <p className="text-muted">Optimized AI models and direct socket connections guarantee real-time response with virtually zero input lag.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon-wrapper">
                <Maximize size={24} className="feature-icon" />
              </div>
              <h3>Smart Bounds</h3>
              <p className="text-muted">Configurable bounding boxes map small hand movements to full-screen navigation, preventing arm fatigue.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={24} className="feature-icon" />
              </div>
              <h3>Secure Accounts</h3>
              <p className="text-muted">Create a personalized profile to save your gesture mappings, custom settings, and usage analytics securely in the cloud.</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="home-footer">
        <p className="text-muted">&copy; 2026 AI Virtual Mouse. Built for the future.</p>
      </footer>
    </div>
  );
};

export default Home;
