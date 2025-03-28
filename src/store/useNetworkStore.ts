import { create } from 'zustand';
import { AnomalyDetector, NetworkPacket } from '../ml/anomalyDetector';
import { useAlertStore } from './useAlertStore';

interface NetworkState {
  detector: AnomalyDetector | null;
  isInitialized: boolean;
  isTraining: boolean;
  trainingProgress: number;
  initialize: () => Promise<void>;
  analyzePacket: (packet: NetworkPacket) => Promise<void>;
  trainModel: (packets: NetworkPacket[]) => Promise<void>;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  detector: null,
  isInitialized: false,
  isTraining: false,
  trainingProgress: 0,

  initialize: async () => {
    const detector = new AnomalyDetector();
    await detector.initialize();
    set({ detector, isInitialized: true });
  },

  analyzePacket: async (packet: NetworkPacket) => {
    const { detector } = get();
    if (!detector) return;

    try {
      const result = await detector.detectAnomaly(packet);
      
      if (result.isAnomaly) {
        const alertStore = useAlertStore.getState();
        alertStore.addAlert({
          id: crypto.randomUUID(),
          type: 'Network Anomaly',
          severity: result.confidence > 90 ? 'critical' : 'high',
          timestamp: new Date().toISOString(),
          description: `Anomalous network behavior detected (Reconstruction Error: ${result.reconstructionError.toFixed(4)})`,
          confidence: Math.round(result.confidence),
          source_ip: packet.sourceIP,
          destination_ip: packet.destinationIP,
          protocol: packet.protocol,
          status: 'new'
        });
      }
    } catch (error) {
      console.error('Error analyzing packet:', error);
    }
  },

  trainModel: async (packets: NetworkPacket[]) => {
    const { detector } = get();
    if (!detector) return;

    set({ isTraining: true, trainingProgress: 0 });

    try {
      await detector.train(packets, 50);
    } catch (error) {
      console.error('Error training model:', error);
    } finally {
      set({ isTraining: false, trainingProgress: 100 });
    }
  }
}));