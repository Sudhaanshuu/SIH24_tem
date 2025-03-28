import React, { useState, useEffect } from 'react';
import { Brain, Activity, TrendingUp } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MLMetric {
  timestamp: string;
  accuracy: number;
  confidence: number;
  falsePositives: number;
}

export const MLInsights: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [metrics, setMetrics] = useState<MLMetric[]>([]);
  const [modelStatus, setModelStatus] = useState({
    accuracy: 0,
    trainingProgress: 0,
    lastUpdate: new Date().toISOString()
  });

  useEffect(() => {
    const updateMetrics = () => {
      const newMetric: MLMetric = {
        timestamp: new Date().toLocaleTimeString(),
        accuracy: 85 + Math.random() * 10,
        confidence: 80 + Math.random() * 15,
        falsePositives: Math.floor(Math.random() * 5)
      };

      setMetrics(prev => [...prev.slice(-20), newMetric]);
      setModelStatus(prev => ({
        ...prev,
        accuracy: newMetric.accuracy,
        lastUpdate: new Date().toISOString()
      }));
    };

    const interval = setInterval(updateMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ML System Insights</h1>
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-emerald-500" />
          <span className="text-emerald-500">Active Learning</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Model Accuracy</h3>
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-emerald-500">
            {modelStatus.accuracy.toFixed(1)}%
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            Last updated: {new Date(modelStatus.lastUpdate).toLocaleTimeString()}
          </p>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">False Positives</h3>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-emerald-500">
            {metrics[metrics.length - 1]?.falsePositives || 0}
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            In the last 24 hours
          </p>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Model Confidence</h3>
            <Brain className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-emerald-500">
            {(metrics[metrics.length - 1]?.confidence || 0).toFixed(1)}%
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            Average prediction confidence
          </p>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="timestamp"
                stroke={isDarkMode ? '#9CA3AF' : '#4B5563'}
              />
              <YAxis stroke={isDarkMode ? '#9CA3AF' : '#4B5563'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '0.5rem',
                }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                name="Accuracy"
              />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#34D399"
                strokeWidth={2}
                dot={false}
                name="Confidence"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};