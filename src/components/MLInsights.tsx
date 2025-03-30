import React, { useState, useEffect } from 'react';
import { Brain, Activity, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as tf from '@tensorflow/tfjs';

interface MLMetric {
  timestamp: string;
  accuracy: number;
  confidence: number;
  falsePositives: number;
  anomalyScore: number;
}

interface ModelPerformance {
  trainingLoss: number[];
  validationLoss: number[];
  accuracy: number[];
  epochs: number[];
}

export const MLInsights: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [metrics, setMetrics] = useState<MLMetric[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance>({
    trainingLoss: [],
    validationLoss: [],
    accuracy: [],
    epochs: []
  });

  useEffect(() => {
    const updateMetrics = () => {
      const newMetric: MLMetric = {
        timestamp: new Date().toLocaleTimeString(),
        accuracy: 85 + Math.random() * 10,
        confidence: 80 + Math.random() * 15,
        falsePositives: Math.floor(Math.random() * 5),
        anomalyScore: Math.random()
      };

      setMetrics(prev => [...prev.slice(-20), newMetric]);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  const trainModel = async () => {
    setIsTraining(true);
    
    try {
      // Create synthetic training data
      const numSamples = 1000;
      const inputDim = 10;
      
      const trainingData = tf.randomNormal([numSamples, inputDim]);
      const labels = tf.randomUniform([numSamples, 1], 0, 2).round();

      // Create a simple neural network
      const model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [inputDim], units: 32, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 16, activation: 'relu' }),
          tf.layers.dense({ units: 1, activation: 'sigmoid' })
        ]
      });

      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      // Train the model
      await model.fit(trainingData, labels, {
        epochs: 20,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            setModelPerformance(prev => ({
              trainingLoss: [...prev.trainingLoss, logs?.loss || 0],
              validationLoss: [...prev.validationLoss, logs?.val_loss || 0],
              accuracy: [...prev.accuracy, logs?.acc || 0],
              epochs: [...prev.epochs, epoch]
            }));
          }
        }
      });

      // Cleanup
      model.dispose();
      trainingData.dispose();
      labels.dispose();
    } catch (error) {
      console.error('Error training model:', error);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Machine Learning Insights</h1>
          <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Real-time ML model performance and analytics
          </p>
        </div>
        <button
          onClick={trainModel}
          disabled={isTraining}
          className={`
            px-4 py-2 rounded-lg flex items-center space-x-2
            ${isDarkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600'}
            text-white transition-colors disabled:opacity-50
          `}
        >
          {isTraining ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Training...</span>
            </>
          ) : (
            <>
              <Brain className="h-5 w-5" />
              <span>Train Model</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Model Accuracy</h3>
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-emerald-500">
            {metrics[metrics.length - 1]?.accuracy.toFixed(1)}%
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            Current prediction accuracy
          </p>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">False Positives</h3>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-500">
            {metrics[metrics.length - 1]?.falsePositives || 0}
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            Last 24 hours
          </p>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Confidence Score</h3>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-emerald-500">
            {metrics[metrics.length - 1]?.confidence.toFixed(1)}%
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            Average prediction confidence
          </p>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <h2 className="text-lg font-semibold mb-4">Real-time Performance Metrics</h2>
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
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                name="Confidence"
              />
              <Line
                type="monotone"
                dataKey="anomalyScore"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
                name="Anomaly Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {modelPerformance.epochs.length > 0 && (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <h2 className="text-lg font-semibold mb-4">Training Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={modelPerformance.epochs.map((epoch, i) => ({
                  epoch,
                  trainingLoss: modelPerformance.trainingLoss[i],
                  validationLoss: modelPerformance.validationLoss[i],
                  accuracy: modelPerformance.accuracy[i]
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis
                  dataKey="epoch"
                  stroke={isDarkMode ? '#9CA3AF' : '#4B5563'}
                  label={{ value: 'Epoch', position: 'bottom' }}
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
                  dataKey="trainingLoss"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                  name="Training Loss"
                />
                <Line
                  type="monotone"
                  dataKey="validationLoss"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                  name="Validation Loss"
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  name="Accuracy"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};