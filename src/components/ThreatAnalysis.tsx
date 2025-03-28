import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Loader2 } from 'lucide-react';
import { useNetworkStore } from '../store/useNetworkStore';
import { useThemeStore } from '../store/useThemeStore';

interface ThreatAnalysisResult {
  timestamp: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  details: string[];
  indicators: {
    type: string;
    value: number;
    threshold: number;
  }[];
}

export const ThreatAnalysis: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { analyzePacket, isInitialized } = useNetworkStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ThreatAnalysisResult[]>([]);

  const analyzeSuspiciousActivity = async () => {
    setIsAnalyzing(true);
    
    // Simulate deep packet inspection and behavioral analysis
    const analysisTime = 3000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, analysisTime));

    const newResult: ThreatAnalysisResult = {
      timestamp: new Date().toISOString(),
      threatLevel: Math.random() > 0.7 ? 'high' : 'low',
      confidence: 75 + Math.random() * 20,
      details: [
        'Unusual outbound connection pattern detected',
        'Multiple failed authentication attempts',
        'Suspicious DNS queries observed'
      ],
      indicators: [
        {
          type: 'Connection Frequency',
          value: 85,
          threshold: 70
        },
        {
          type: 'Data Transfer Volume',
          value: 65,
          threshold: 80
        },
        {
          type: 'Failed Auth Rate',
          value: 90,
          threshold: 60
        }
      ]
    };

    setResults(prev => [newResult, ...prev]);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (isInitialized) {
      analyzeSuspiciousActivity();
    }
  }, [isInitialized]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Threat Analysis</h1>
        <button
          onClick={analyzeSuspiciousActivity}
          disabled={isAnalyzing}
          className={`
            px-4 py-2 rounded-lg flex items-center space-x-2
            ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'}
            text-white transition-colors disabled:opacity-50
          `}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Shield className="h-5 w-5" />
              <span>Run Analysis</span>
            </>
          )}
        </button>
      </div>

      <div className="grid gap-6">
        {results.map((result, index) => (
          <div
            key={index}
            className={`
              ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
              rounded-lg shadow-lg p-6
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle
                  className={`h-6 w-6 ${
                    result.threatLevel === 'critical' ? 'text-red-500' :
                    result.threatLevel === 'high' ? 'text-orange-500' :
                    result.threatLevel === 'medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    {result.threatLevel.charAt(0).toUpperCase() + result.threatLevel.slice(1)} Risk Detected
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">
                  {Math.round(result.confidence)}% Confidence
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Detection Details</h4>
                <ul className={`list-disc list-inside ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {result.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Risk Indicators</h4>
                <div className="space-y-2">
                  {result.indicators.map((indicator, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span>{indicator.type}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              indicator.value > indicator.threshold ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${indicator.value}%` }}
                          />
                        </div>
                        <span className="text-sm">{indicator.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};