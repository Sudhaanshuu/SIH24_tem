import React, { useEffect } from 'react';
import { AlertTriangle, Network, Brain, Lock, BarChart3, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useAlertStore } from '../store/useAlertStore';
import { useNetworkStore } from '../store/useNetworkStore';
import { MLStatus } from './MLStatus';

// Simulated network packets for demonstration
const simulatedPackets = [
  {
    sourceIP: '192.168.1.100',
    destinationIP: '203.0.113.0',
    protocol: 'TCP',
    bytesTransferred: 1500,
    packetsPerSecond: 100,
    averagePacketSize: 1024,
    connectionDuration: 30,
    portNumber: 443
  },
  {
    sourceIP: '192.168.1.150',
    destinationIP: '198.51.100.0',
    protocol: 'HTTP',
    bytesTransferred: 5000,
    packetsPerSecond: 500,
    averagePacketSize: 512,
    connectionDuration: 15,
    portNumber: 80
  }
];

export const Dashboard: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { alerts, filterAlerts } = useAlertStore();
  const { analyzePacket, isInitialized } = useNetworkStore();
  
  const activeAlerts = filterAlerts(undefined, 'new');
  const criticalAlerts = filterAlerts('critical');

  // Simulate real-time packet analysis
  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      const randomPacket = simulatedPackets[Math.floor(Math.random() * simulatedPackets.length)];
      analyzePacket({
        ...randomPacket,
        bytesTransferred: randomPacket.bytesTransferred * (0.5 + Math.random()),
        packetsPerSecond: randomPacket.packetsPerSecond * (0.5 + Math.random()),
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isInitialized, analyzePacket]);

  const stats = [
    {
      title: 'Active Threats',
      value: activeAlerts.length,
      icon: AlertTriangle,
      color: 'text-red-500'
    },
    {
      title: 'Network Health',
      value: '98%',
      icon: Network,
      color: 'text-green-500'
    },
    {
      title: 'ML Accuracy',
      value: '95.6%',
      icon: Brain,
      color: 'text-blue-500'
    },
    {
      title: 'Assets Protected',
      value: '1,893',
      icon: Lock,
      color: 'text-indigo-500'
    }
  ];

  return (
    <main className={`container mx-auto px-4 py-8 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
            <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Real-Time Threat Detection</h2>
                <BarChart3 className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {alerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className={`flex items-center justify-between ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}
                  >
                    <div className="flex items-center space-x-4">
                      {alert.severity === 'critical' ? (
                        <AlertCircle className="h-6 w-6 text-red-500" />
                      ) : alert.severity === 'high' ? (
                        <AlertTriangle className="h-6 w-6 text-orange-500" />
                      ) : (
                        <CheckCircle2 className="h-6 w-6 text-yellow-500" />
                      )}
                      <div>
                        <h3 className="font-medium">{alert.type}</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {alert.description}
                        </p>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                          {alert.source_ip} → {alert.destination_ip} ({alert.protocol})
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Confidence: {alert.confidence}%
                        </div>
                        <div className={`flex items-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <MLStatus />
        </div>
      </div>
    </main>
  );
};