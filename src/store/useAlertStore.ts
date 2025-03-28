import { create } from 'zustand';
import { format } from 'date-fns';

export interface Alert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  confidence: number;
  source_ip?: string;
  destination_ip?: string;
  protocol?: string;
  status: 'new' | 'investigating' | 'resolved';
}

interface AlertStore {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  updateAlertStatus: (id: string, status: Alert['status']) => void;
  filterAlerts: (severity?: Alert['severity'], status?: Alert['status']) => Alert[];
}

export const useAlertStore = create<AlertStore>((set, get) => ({
  alerts: [
    {
      id: '1',
      type: 'Network Anomaly',
      severity: 'high',
      timestamp: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss'),
      description: 'Unusual outbound traffic pattern detected via RNN analysis',
      confidence: 92,
      source_ip: '192.168.1.100',
      destination_ip: '203.0.113.0',
      protocol: 'TCP',
      status: 'new'
    },
    {
      id: '2',
      type: 'Zero-Day Threat',
      severity: 'critical',
      timestamp: format(new Date(Date.now() - 5 * 60000), 'yyyy-MM-dd\'T\'HH:mm:ss'),
      description: 'Unknown malware signature detected through deep learning analysis',
      confidence: 95,
      source_ip: '192.168.1.150',
      destination_ip: '198.51.100.0',
      protocol: 'HTTP',
      status: 'investigating'
    }
  ],
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  updateAlertStatus: (id, status) => set((state) => ({
    alerts: state.alerts.map(alert =>
      alert.id === id ? { ...alert, status } : alert
    )
  })),
  filterAlerts: (severity, status) => {
    const { alerts } = get();
    return alerts.filter(alert => 
      (!severity || alert.severity === severity) &&
      (!status || alert.status === status)
    );
  }
}));