import React, { useState, useEffect } from 'react';
import { Network, ArrowRight, AlertCircle, Loader2, Shield, Activity } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface NetworkScan {
  id: string;
  timestamp: number;
  source: string;
  destination: string;
  protocol: string;
  port: number;
  status: 'normal' | 'suspicious' | 'malicious';
  risk: 'low' | 'medium' | 'high' | 'critical';
  bytesTransferred: number;
  packetsTransferred: number;
  duration: number;
  anomalyScore: number;
  signatures: string[];
}

export const NetworkTraffic: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [isScanning, setIsScanning] = useState(false);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [activeScans, setActiveScans] = useState<NetworkScan[]>([]);
  const [selectedScan, setSelectedScan] = useState<string | null>(null);
  const [scanStats, setScanStats] = useState({
    totalScanned: 0,
    threatsDetected: 0,
    activeConnections: 0
  });

  // Simulate network scanning
  const startNetworkScan = () => {
    setIsScanning(true);
    const scanInterval = setInterval(() => {
      const newScan: NetworkScan = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        destination: `203.0.113.${Math.floor(Math.random() * 255)}`,
        protocol: ['TCP', 'UDP', 'HTTP', 'HTTPS'][Math.floor(Math.random() * 4)],
        port: [80, 443, 8080, 3306, 22][Math.floor(Math.random() * 5)],
        status: Math.random() > 0.8 ? 'suspicious' : 'normal',
        risk: Math.random() > 0.9 ? 'critical' : Math.random() > 0.7 ? 'high' : 'low',
        bytesTransferred: Math.floor(Math.random() * 1000000),
        packetsTransferred: Math.floor(Math.random() * 1000),
        duration: Math.floor(Math.random() * 300),
        anomalyScore: Math.random(),
        signatures: ['Port scanning', 'Unusual traffic pattern', 'Known malware signature']
          .filter(() => Math.random() > 0.7)
      };

      setActiveScans(prev => {
        const updated = [newScan, ...prev].slice(0, 10);
        setScanStats(stats => ({
          totalScanned: stats.totalScanned + 1,
          threatsDetected: stats.threatsDetected + (newScan.risk === 'critical' ? 1 : 0),
          activeConnections: updated.length
        }));
        return updated;
      });

      setTrafficData(prev => {
        const newData = {
          time: new Date().toLocaleTimeString(),
          bytesIn: Math.floor(Math.random() * 1000000),
          bytesOut: Math.floor(Math.random() * 800000),
          anomalyScore: newScan.anomalyScore
        };
        return [...prev.slice(-20), newData];
      });
    }, 2000);

    return () => clearInterval(scanInterval);
  };

  useEffect(() => {
    const cleanup = startNetworkScan();
    return () => cleanup();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Network Traffic Analysis</h1>
          <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Real-time network monitoring and threat detection
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-emerald-500" />
            <span className="text-emerald-500">Active Scanning</span>
          </div>
          {isScanning && (
            <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Scanned</h3>
            <Shield className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-emerald-500">
            {scanStats.totalScanned}
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            Connections analyzed
          </p>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Threats Detected</h3>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-500">
            {scanStats.threatsDetected}
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            Critical threats identified
          </p>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Connections</h3>
            <Network className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-emerald-500">
            {scanStats.activeConnections}
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            Current monitored connections
          </p>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <h2 className="text-lg font-semibold mb-4">Traffic Overview</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis
                dataKey="time"
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
                dataKey="bytesIn"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                name="Bytes In"
              />
              <Line
                type="monotone"
                dataKey="anomalyScore"
                stroke="#EF4444"
                strokeWidth={2}
                dot={false}
                name="Anomaly Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <h2 className="text-lg font-semibold mb-4">Active Scans</h2>
        <div className="space-y-4">
          {activeScans.map((scan) => (
            <div
              key={scan.id}
              className={`
                p-4 rounded-lg cursor-pointer transition-colors
                ${selectedScan === scan.id
                  ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  : isDarkMode ? 'bg-gray-900 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                }
              `}
              onClick={() => setSelectedScan(scan.id === selectedScan ? null : scan.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span>{scan.source}</span>
                    <ArrowRight className="h-4 w-4" />
                    <span>{scan.destination}</span>
                  </div>
                  <span className={`
                    px-2 py-1 rounded text-sm font-medium
                    ${scan.risk === 'critical' ? 'bg-red-100 text-red-800' :
                      scan.risk === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-emerald-100 text-emerald-800'}
                  `}>
                    {scan.risk.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>{scan.protocol}</span>
                  <span>Port {scan.port}</span>
                  {scan.status === 'suspicious' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>

              {selectedScan === scan.id && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Bytes Transferred
                    </span>
                    <div className="font-medium">
                      {(scan.bytesTransferred / 1024).toFixed(2)} KB
                    </div>
                  </div>
                  <div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Packets
                    </span>
                    <div className="font-medium">{scan.packetsTransferred}</div>
                  </div>
                  <div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Duration
                    </span>
                    <div className="font-medium">{scan.duration}s</div>
                  </div>
                  <div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Anomaly Score
                    </span>
                    <div className="font-medium">
                      {(scan.anomalyScore * 100).toFixed(2)}%
                    </div>
                  </div>
                  {scan.signatures.length > 0 && (
                    <div className="col-span-full">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                        Detected Signatures
                      </span>
                      <div className="font-medium mt-1">
                        {scan.signatures.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};