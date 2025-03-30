import React, { useState, useEffect } from 'react';
import { History, Filter, Search, AlertTriangle, Shield, Clock } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { format } from 'date-fns';

interface Event {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  source: string;
  status: 'resolved' | 'investigating' | 'new';
  category: 'security' | 'network' | 'system';
  details: Record<string, string>;
}

export const EventHistory: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Simulate real-time event updates
    const updateEvents = () => {
      const newEvent: Event = {
        id: crypto.randomUUID(),
        type: ['Suspicious Activity', 'Network Scan', 'Authentication Failure'][
          Math.floor(Math.random() * 3)
        ],
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as Event['severity'],
        timestamp: new Date().toISOString(),
        description: 'Automated security analysis detected potential threat',
        source: `192.168.1.${Math.floor(Math.random() * 255)}`,
        status: 'new',
        category: ['security', 'network', 'system'][Math.floor(Math.random() * 3)] as Event['category'],
        details: {
          'IP Address': `192.168.1.${Math.floor(Math.random() * 255)}`,
          'Port': `${Math.floor(Math.random() * 65535)}`,
          'Protocol': ['TCP', 'UDP', 'HTTP'][Math.floor(Math.random() * 3)],
          'Action Taken': ['Blocked', 'Monitored', 'Logged'][Math.floor(Math.random() * 3)]
        }
      };

      setEvents(prev => {
        const updated = [newEvent, ...prev];
        // Keep only last 50 events for performance
        return updated.slice(0, 50);
      });
    };

    // Initial events
    updateEvents();
    updateEvents();
    updateEvents();

    const interval = setInterval(updateEvents, 30000); // Add new event every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || event.severity === filterSeverity;
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    return matchesSearch && matchesSeverity && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Event History</h1>
        <div className="flex items-center space-x-2">
          <History className="h-6 w-6 text-emerald-500" />
          <span className="text-emerald-500">Security Events Log</span>
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
          <div className="flex items-center space-x-4">
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

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`
                rounded-lg px-4 py-2
                ${isDarkMode 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-50 text-gray-900'}
                focus:outline-none focus:ring-2 focus:ring-emerald-500
              `}
            >
              <option value="all">All Categories</option>
              <option value="security">Security</option>
              <option value="network">Network</option>
              <option value="system">System</option>
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
                    <span className={`
                      px-2 py-1 rounded text-sm font-medium
                      ${event.category === 'security' ? 'bg-purple-100 text-purple-800' :
                        event.category === 'network' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {event.category.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-semibold">{event.type}</h3>
                  </div>
                  <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {event.description}
                  </p>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(event.details).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                          {key}:
                        </span>
                        <span className="ml-1 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`
                    px-2 py-1 rounded text-sm
                    ${event.status === 'new' ? 'bg-emerald-100 text-emerald-800' :
                      event.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {event.status.toUpperCase()}
                  </span>
                  <div className={`flex items-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Clock className="h-4 w-4 mr-1" />
                    {format(new Date(event.timestamp), 'HH:mm:ss')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};