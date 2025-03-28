import React from 'react';
import { Shield, Activity, Brain, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

export const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <header className={`${isDarkMode ? 'bg-gray-900' : 'bg-indigo-600'} text-white p-4 shadow-lg`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Raksha Netra</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Active Protection</span>
          </div>
          <div className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">AI Learning: Active</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};