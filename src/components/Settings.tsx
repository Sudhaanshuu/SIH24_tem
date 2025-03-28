import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Shield } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

export const Settings: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [settings, setSettings] = useState({
    scanInterval: 5,
    alertThreshold: 75,
    retentionDays: 30,
    autoUpdate: true,
    enableML: true,
    enableRealTimeAlerts: true
  });

  const handleSave = () => {
    // Simulate saving settings
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <div className="flex items-center space-x-2">
          <SettingsIcon className="h-6 w-6 text-emerald-500" />
          <span className="text-emerald-500">Configuration</span>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Scanning Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Scan Interval (minutes)
                </label>
                <input
                  type="number"
                  value={settings.scanInterval}
                  onChange={(e) => setSettings({...settings, scanInterval: parseInt(e.target.value)})}
                  className={`
                    w-full px-4 py-2 rounded-lg
                    ${isDarkMode 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-50 text-gray-900'}
                    focus:outline-none focus:ring-2 focus:ring-emerald-500
                  `}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Alert Threshold (%)
                </label>
                <input
                  type="number"
                  value={settings.alertThreshold}
                  onChange={(e) => setSettings({...settings, alertThreshold: parseInt(e.target.value)})}
                  className={`
                    w-full px-4 py-2 rounded-lg
                    ${isDarkMode 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-50 text-gray-900'}
                    focus:outline-none focus:ring-2 focus:ring-emerald-500
                  `}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">System Configuration</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Dark Mode</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Toggle dark/light theme
                  </p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    ${isDarkMode ? 'bg-emerald-500' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition
                      ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto Updates</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Automatically update threat definitions
                  </p>
                </div>
                <button
                  onClick={() => setSettings({...settings, autoUpdate: !settings.autoUpdate})}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    ${settings.autoUpdate ? 'bg-emerald-500' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition
                      ${settings.autoUpdate ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">ML-Based Detection</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Enable machine learning detection
                  </p>
                </div>
                <button
                  onClick={() => setSettings({...settings, enableML: !settings.enableML})}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    ${settings.enableML ? 'bg-emerald-500' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition
                      ${settings.enableML ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => window.location.reload()}
            className={`
              px-4 py-2 rounded-lg flex items-center space-x-2
              ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}
            `}
          >
            <RefreshCw className="h-5 w-5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-emerald-500" />
          <h3 className="text-lg font-semibold">System Status</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Last Update
            </p>
            <p className="font-medium mt-1">
              {new Date().toLocaleString()}
            </p>
          </div>
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Threat Database
            </p>
            <p className="font-medium mt-1 text-emerald-500">
              Up to date
            </p>
          </div>
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              System Health
            </p>
            <p className="font-medium mt-1 text-emerald-500">
              Optimal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};