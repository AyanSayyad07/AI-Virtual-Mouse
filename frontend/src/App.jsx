import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { connectSocket, disconnectSocket } from './services/socketService';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import Home from './pages/Home';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, []);

  useEffect(() => {
    let interval;
    if (isCameraActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      setSessionTime(0);
    }
    return () => clearInterval(interval);
  }, [isCameraActive]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Check if current path is an auth page or the home page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isHomePage = location.pathname === '/';

  if (isHomePage) {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    );
  }

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login setIsCameraActive={setIsCameraActive} />} />
        <Route path="/register" element={<Register setIsCameraActive={setIsCameraActive} />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Sidebar isCameraActive={isCameraActive} />
      <div className="main-content">
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/dashboard" element={<Dashboard isCameraActive={isCameraActive} setIsCameraActive={setIsCameraActive} sessionTime={sessionTime} />} />
          <Route path="/profile" element={<ProfilePage setIsCameraActive={setIsCameraActive} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<div style={{padding: '2rem'}}>About Page Placeholder</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
