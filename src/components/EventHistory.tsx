import React, { useState } from 'react';
import { History, Filter, Search } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

interface Event {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  source: string;
  status: 'resolved' | 'investigating' | 'new';
}

export const EventHistory: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const events: Event[] = [
    {
      id: '1',
      type: 'Network Scan',
      severity: 'low',
      timestamp: '2024-03-15T10:30:00',
      description: 'Port scanning activity detected from external IP',
      source: '192.168.1.100',
      status: 'resolved'
    },
    {
      id: '2',
      type: 'Brute Force Attempt',
      severity: 'high',
      timestamp: '2024-03-15T11:15:00',
      description: 'Multiple failed login attempts detected',
      source: '203.0.113.0',
      status: 'investigating'
    },
    {
      id: '3',
      type: 'Malware Detection',
      severity: 'critical',
      timestamp: '2024-03-15T12:00:00',
      description: 'Suspicious file activity detected in system directory',
      source: 'System',
      status: 'new'
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || event.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Event History</h1>
        <div className="flex items-center space-x-2">
          <History className="h-6 w-6 text-emerald-500" />
          <span className="text-emerald-500">Event Log</span>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`
                w-full pl-10 pr-4 py-2 rounded-lg
                ${isDarkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400' 
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500'}
                focus:outline-none focus:ring-2 focus:ring-emerald-500
              `}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-emerald-500" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className={`
                rounded-lg px-4 py-2
                ${isDarkMode 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-50 text-gray-900'}
                focus:outline-none focus:ring-2 focus:ring-emerald-500
              `}
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
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
                      ${event.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        event.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-emerald-100 text-emerald-800'}
                    `}>
                      {event.severity.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-semibold">{event.type}</h3>
                  </div>
                  <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {event.description}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Source: {event.source}
                    </span>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className={`
                  px-2 py-1 rounded text-sm
                  ${event.status === 'new' ? 'bg-emerald-100 text-emerald-800' :
                    event.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'}
                `}>
                  {event.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};