import React, { useEffect } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { useNetworkStore } from '../store/useNetworkStore';
import { useThemeStore } from '../store/useThemeStore';

export const MLStatus: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { isInitialized, isTraining, initialize } = useNetworkStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">ML System Status</h2>
        <Brain className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Model Status</span>
          <span className={`flex items-center ${isInitialized ? 'text-green-500' : 'text-yellow-500'}`}>
            {isInitialized ? 'Active' : 'Initializing...'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Training Status</span>
          <span className="flex items-center">
            {isTraining ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-500" />
                Training in Progress
              </>
            ) : (
              <span className="text-green-500">Ready</span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Last Update</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};