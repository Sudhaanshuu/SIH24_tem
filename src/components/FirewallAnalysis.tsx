import React, { useState, useEffect } from 'react';
import { Shield, Wifi, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

interface FirewallStatus {
  isEnabled: boolean;
  lastChecked: Date;
  vulnerabilities: FirewallVulnerability[];
  rules: FirewallRule[];
  ports: PortStatus[];
}

interface FirewallVulnerability {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  recommendation: string;
}

interface FirewallRule {
  id: string;
  name: string;
  action: 'allow' | 'deny';
  protocol: string;
  source: string;
  destination: string;
  port: number;
  isActive: boolean;
}

interface PortStatus {
  port: number;
  service: string;
  status: 'open' | 'closed' | 'filtered';
  risk: 'low' | 'medium' | 'high';
}

export const FirewallAnalysis: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [isScanning, setIsScanning] = useState(false);
  const [firewallStatus, setFirewallStatus] = useState<FirewallStatus | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const analyzeFirewall = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate firewall analysis
    const analysis = {
      isEnabled: Math.random() > 0.2,
      lastChecked: new Date(),
      vulnerabilities: [
        {
          id: '1',
          severity: 'high',
          description: 'Weak firewall rule configuration detected',
          impact: 'Potential unauthorized access to sensitive services',
          recommendation: 'Review and strengthen firewall rules'
        },
        {
          id: '2',
          severity: 'critical',
          description: 'Outdated firewall firmware version',
          impact: 'Known security vulnerabilities may be exploitable',
          recommendation: 'Update firewall firmware to latest version'
        }
      ],
      rules: [
        {
          id: '1',
          name: 'HTTP Access',
          action: 'allow',
          protocol: 'TCP',
          source: 'Any',
          destination: 'Internal Network',
          port: 80,
          isActive: true
        },
        {
          id: '2',
          name: 'SSH Access',
          action: 'deny',
          protocol: 'TCP',
          source: 'External',
          destination: 'Internal Network',
          port: 22,
          isActive: true
        }
      ],
      ports: [
        {
          port: 80,
          service: 'HTTP',
          status: 'open',
          risk: 'medium'
        },
        {
          port: 443,
          service: 'HTTPS',
          status: 'open',
          risk: 'low'
        },
        {
          port: 22,
          service: 'SSH',
          status: 'filtered',
          risk: 'high'
        }
      ]
    };

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setFirewallStatus(analysis);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  useEffect(() => {
    analyzeFirewall();
  }, []);

  const getSecurityScore = () => {
    if (!firewallStatus) return 0;
    
    let score = 100;
    
    // Deduct points for vulnerabilities
    const vulnPoints = {
      low: 5,
      medium: 10,
      high: 20,
      critical: 30
    };
    
    firewallStatus.vulnerabilities.forEach(vuln => {
      score -= vulnPoints[vuln.severity];
    });

    // Deduct points for high-risk open ports
    firewallStatus.ports.forEach(port => {
      if (port.status === 'open' && port.risk === 'high') {
        score -= 10;
      }
    });

    // Penalty for disabled firewall
    if (!firewallStatus.isEnabled) {
      score -= 50;
    }

    return Math.max(0, score);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Firewall Security Analysis</h1>
          <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Comprehensive firewall security assessment
          </p>
        </div>
        <button
          onClick={analyzeFirewall}
          disabled={isScanning}
          className={`
            px-4 py-2 rounded-lg flex items-center space-x-2
            ${isDarkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600'}
            text-white transition-colors disabled:opacity-50
          `}
        >
          {isScanning ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <Shield className="h-5 w-5" />
              <span>Analyze Now</span>
            </>
          )}
        </button>
      </div>

      {isScanning && (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Scanning Firewall</h3>
            <span className="text-emerald-500">{scanProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      )}

      {firewallStatus && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Firewall Status</h3>
                {firewallStatus.isEnabled ? (
                  <Shield className="h-6 w-6 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                )}
              </div>
              <div className="text-3xl font-bold">
                {firewallStatus.isEnabled ? (
                  <span className="text-emerald-500">Active</span>
                ) : (
                  <span className="text-red-500">Disabled</span>
                )}
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                Last checked: {firewallStatus.lastChecked.toLocaleString()}
              </p>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Security Score</h3>
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-emerald-500">
                {getSecurityScore()}%
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                Based on current security analysis
              </p>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Critical Issues</h3>
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-red-500">
                {firewallStatus.vulnerabilities.filter(v => v.severity === 'critical').length}
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                Critical vulnerabilities detected
              </p>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h2 className="text-lg font-semibold mb-4">Vulnerabilities</h2>
            <div className="space-y-4">
              {firewallStatus.vulnerabilities.map(vuln => (
                <div
                  key={vuln.id}
                  className={`
                    p-4 rounded-lg
                    ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`
                          px-2 py-1 rounded text-sm font-medium
                          ${vuln.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            vuln.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            vuln.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-emerald-100 text-emerald-800'}
                        `}>
                          {vuln.severity.toUpperCase()}
                        </span>
                        <h3 className="text-lg font-semibold">{vuln.description}</h3>
                      </div>
                      <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {vuln.impact}
                      </p>
                      <div className="mt-2">
                        <span className="font-medium">Recommendation: </span>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {vuln.recommendation}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h2 className="text-lg font-semibold mb-4">Port Analysis</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    <th className="text-left py-2">Port</th>
                    <th className="text-left py-2">Service</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {firewallStatus.ports.map(port => (
                    <tr key={port.port} className="border-t border-gray-200">
                      <td className="py-2">{port.port}</td>
                      <td className="py-2">{port.service}</td>
                      <td className="py-2">
                        <span className={`
                          px-2 py-1 rounded text-sm
                          ${port.status === 'open'
                            ? 'bg-red-100 text-red-800'
                            : port.status === 'filtered'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-emerald-100 text-emerald-800'}
                        `}>
                          {port.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2">
                        <span className={`
                          px-2 py-1 rounded text-sm
                          ${port.risk === 'high'
                            ? 'bg-red-100 text-red-800'
                            : port.risk === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-emerald-100 text-emerald-800'}
                        `}>
                          {port.risk.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};