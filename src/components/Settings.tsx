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

  const handleChange = (field: keyof typeof settings, value: number | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Simulate saving settings
    console.log('Saving settings:', settings);
    // Here you would typically make an API call
  };

  const handleReset = () => {
    setSettings({
      scanInterval: 5,
      alertThreshold: 75,
      retentionDays: 30,
      autoUpdate: true,
      enableML: true,
      enableRealTimeAlerts: true
    });
  };

  // Toggle switch component to reduce repetition
  const ToggleSwitch = ({ 
    label, 
    description, 
    isActive, 
    onChange 
  }: { 
    label: string; 
    description: string; 
    isActive: boolean; 
    onChange: () => void 
  }) => (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium">{label}</h4>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          ${isActive ? 'bg-emerald-500' : 'bg-gray-200'}
        `}
        aria-pressed={isActive}
        aria-label={`${isActive ? 'Disable' : 'Enable'} ${label}`}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition
            ${isActive ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );

  // Input field component to reduce repetition
  const NumberInput = ({
    id,
    label,
    value,
    onChange,
    min = 0,
    max
  }: {
    id: keyof typeof settings;
    label: string;
    value: number;
    onChange: (field: keyof typeof settings, value: number) => void;
    min?: number;
    max?: number;
  }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => {
          const parsed = parseInt(e.target.value);
          onChange(id, isNaN(parsed) ? min : parsed);
        }}
        className={`
          w-full px-4 py-2 rounded-lg
          ${isDarkMode 
            ? 'bg-gray-700 text-white border-gray-600' 
            : 'bg-gray-50 text-gray-900 border-gray-200'}
          border focus:outline-none focus:ring-2 focus:ring-emerald-500
        `}
        min={min}
        max={max}
      />
    </div>
  );

  // Status item component
  const StatusItem = ({ label, value, isSuccess = false }: { label: string; value: string; isSuccess?: boolean }) => (
    <div>
      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {label}
      </p>
      <p className={`font-medium mt-1 ${isSuccess ? 'text-emerald-500' : ''}`}>
        {value}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <div className="flex items-center space-x-2">
          <SettingsIcon className="h-6 w-6 text-emerald-500" />
          <span className="text-emerald-500">Configuration</span>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Scanning Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NumberInput
                  id="scanInterval"
                  label="Scan Interval (minutes)"
                  value={settings.scanInterval}
                  onChange={handleChange}
                  min={1}
                />
                <NumberInput
                  id="alertThreshold"
                  label="Alert Threshold (%)"
                  value={settings.alertThreshold}
                  onChange={handleChange}
                  min={0}
                  max={100}
                />
                <NumberInput
                  id="retentionDays"
                  label="Retention Days"
                  value={settings.retentionDays}
                  onChange={handleChange}
                  min={1}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">System Configuration</h3>
              <div className="space-y-4">
                <ToggleSwitch
                  label="Dark Mode"
                  description="Toggle dark/light theme"
                  isActive={isDarkMode}
                  onChange={toggleDarkMode}
                />
                <ToggleSwitch
                  label="Auto Updates"
                  description="Automatically update threat definitions"
                  isActive={settings.autoUpdate}
                  onChange={() => handleChange('autoUpdate', !settings.autoUpdate)}
                />
                <ToggleSwitch
                  label="ML-Based Detection"
                  description="Enable machine learning detection"
                  isActive={settings.enableML}
                  onChange={() => handleChange('enableML', !settings.enableML)}
                />
                <ToggleSwitch
                  label="Real-Time Alerts"
                  description="Enable instant notifications for threats"
                  isActive={settings.enableRealTimeAlerts}
                  onChange={() => handleChange('enableRealTimeAlerts', !settings.enableRealTimeAlerts)}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className={`
                px-4 py-2 rounded-lg flex items-center space-x-2
                ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}
              `}
            >
              <RefreshCw className="h-5 w-5" />
              <span>Reset</span>
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-emerald-500" />
          <h3 className="text-lg font-semibold">System Status</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatusItem 
            label="Last Update" 
            value={new Date().toLocaleString()} 
          />
          <StatusItem 
            label="Threat Database" 
            value="Up to date" 
            isSuccess 
          />
          <StatusItem 
            label="System Health" 
            value="Optimal" 
            isSuccess 
          />
        </div>
      </div>
    </div>
  );
};