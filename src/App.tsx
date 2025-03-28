import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ThreatAnalysis } from './components/ThreatAnalysis';
import { NetworkTraffic } from './components/NetworkTraffic';
import { MLInsights } from './components/MLInsights';
import { EventHistory } from './components/EventHistory';
import { Settings } from './components/Settings';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const { isDarkMode } = useThemeStore();

  return (
    <Router>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Navbar />
        <div className="pl-64">
          <div className="container mx-auto p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/threats" element={<ThreatAnalysis />} />
              <Route path="/network" element={<NetworkTraffic />} />
              <Route path="/ml-insights" element={<MLInsights />} />
              <Route path="/history" element={<EventHistory />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App