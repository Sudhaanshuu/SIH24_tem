import React from 'react';
import { Shield, Activity, Brain, AlertTriangle, Settings, History, Database, Network } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Activity, label: 'Dashboard' },
    { path: '/threats', icon: AlertTriangle, label: 'Threat Analysis' },
    { path: '/network', icon: Network, label: 'Network Traffic' },
    { path: '/ml-insights', icon: Brain, label: 'ML Insights' },
    { path: '/history', icon: History, label: 'Event History' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed left-0 top-0 h-full w-64 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="h-8 w-8 text-indigo-500" />
          <h1 className="text-xl font-bold">Raksha Netra</h1>
        </div>

        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${isActive(item.path)
                  ? `${isDarkMode ? 'bg-indigo-500' : 'bg-indigo-100'} text-indigo-700`
                  : `${isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="flex items-center space-x-3">
          <Database className="h-5 w-5 text-green-500" />
          <div className="text-sm">
            <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>System Status</div>
            <div className="font-medium">Healthy</div>
          </div>
        </div>
      </div>
    </nav>
  );
};