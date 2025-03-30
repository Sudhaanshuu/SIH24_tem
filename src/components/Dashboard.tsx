import React, { useEffect, useState } from 'react';
import { AlertTriangle, Network, Brain, Lock, BarChart3, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useAlertStore } from '../store/useAlertStore';
import { useNetworkStore } from '../store/useNetworkStore';
import { MLStatus } from './MLStatus';

interface UniqueAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  latestTimestamp: string;
  description: string;
  source_ip?: string;
  destination_ip?: string;
  protocol?: string;
  confidence: number;
}

export const Dashboard: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { alerts, filterAlerts } = useAlertStore();
  const { analyzePacket, isInitialized } = useNetworkStore();
  const [uniqueAlerts, setUniqueAlerts] = useState<UniqueAlert[]>([]);
  
  useEffect(() => {
    // Group similar alerts together
    const alertMap = new Map<string, UniqueAlert>();
    
    alerts.forEach(alert => {
      const key = `${alert.type}-${alert.severity}-${alert.source_ip}-${alert.destination_ip}`;
      
      if (alertMap.has(key)) {
        const existing = alertMap.get(key)!;
        alertMap.set(key, {
          ...existing,
          count: existing.count + 1,
          latestTimestamp: alert.timestamp,
          confidence: Math.max(existing.confidence, alert.confidence)
        });
      } else {
        alertMap.set(key, {
          id: alert.id,
          type: alert.type,
          severity: alert.severity,
          count: 1,
          latestTimestamp: alert.timestamp,
          description: alert.description,
          source_ip: alert.source_ip,
          destination_ip: alert.destination_ip,
          protocol: alert.protocol,
          confidence: alert.confidence
        });
      }
    });

    setUniqueAlerts(Array.from(alertMap.values())
      .sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
      .slice(0, 5)); // Show only top 5 most severe alerts
  }, [alerts]);

  const stats = [
    {
      title: 'Active Threats',
      value: uniqueAlerts.length,
      icon: AlertTriangle,
      color: 'text-red-500'
    },
    {
      title: 'Network Health',
      value: `${Math.max(0, 100 - uniqueAlerts.length * 5)}%`,
      icon: Network,
      color: 'text-emerald-500'
    },
    {
      title: 'Protected Assets',
      value: '1,893',
      icon: Lock,
      color: 'text-emerald-500'
    },
    {
      title: 'Detection Rate',
      value: '99.2%',
      icon: Brain,
      color: 'text-emerald-500'
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
                <h2 className="text-xl font-semibold">Active Security Threats</h2>
                <BarChart3 className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {uniqueAlerts.map(alert => (
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
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{alert.type}</h3>
                          <span className={`
                            px-2 py-1 rounded-full text-xs
                            ${alert.count > 1 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}
                          `}>
                            {alert.count} {alert.count === 1 ? 'occurrence' : 'occurrences'}
                          </span>
                        </div>
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
                          {new Date(alert.latestTimestamp).toLocaleTimeString()}
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