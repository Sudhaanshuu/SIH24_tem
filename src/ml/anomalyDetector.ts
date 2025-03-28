import * as tf from '@tensorflow/tfjs';

export interface NetworkPacket {
  sourceIP: string;
  destinationIP: string;
  protocol: string;
  bytesTransferred: number;
  packetsPerSecond: number;
  averagePacketSize: number;
  connectionDuration: number;
  portNumber: number;
}

export class AnomalyDetector {
  private model: tf.LayersModel | null = null;
  private readonly inputFeatures = 6;
  private readonly threshold = 0.8;
  private normalizer: tf.LayersModel | null = null;

  async initialize() {
    // Create an autoencoder model for anomaly detection
    this.model = tf.sequential();
    
    // Encoder layers
    this.model.add(tf.layers.dense({
      inputShape: [this.inputFeatures],
      units: 32,
      activation: 'relu',
      kernelRegularizer: tf.regularizers.l1l2({ l1: 1e-5, l2: 1e-5 })
    }));
    
    this.model.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));
    
    this.model.add(tf.layers.dense({
      units: 8,
      activation: 'relu'
    }));
    
    // Decoder layers
    this.model.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));
    
    this.model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));
    
    this.model.add(tf.layers.dense({
      units: this.inputFeatures,
      activation: 'sigmoid'
    }));

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });

    // Initialize normalizer
    await this.initializeNormalizer();
  }

  private async initializeNormalizer() {
    this.normalizer = tf.sequential();
    this.normalizer.add(tf.layers.dense({
      inputShape: [this.inputFeatures],
      units: this.inputFeatures,
      useBias: true
    }));
  }

  private normalizePacket(packet: NetworkPacket): tf.Tensor {
    const features = [
      packet.bytesTransferred,
      packet.packetsPerSecond,
      packet.averagePacketSize,
      packet.connectionDuration,
      packet.portNumber,
      this.hashIPToNumber(packet.sourceIP) % 100 // Simple feature hashing
    ];
    
    return tf.tensor2d([features]);
  }

  private hashIPToNumber(ip: string): number {
    return ip.split('.').reduce((acc, octet) => acc * 256 + parseInt(octet, 10), 0);
  }

  async detectAnomaly(packet: NetworkPacket): Promise<{
    isAnomaly: boolean;
    confidence: number;
    reconstructionError: number;
  }> {
    if (!this.model || !this.normalizer) {
      throw new Error('Model not initialized');
    }

    const input = this.normalizePacket(packet);
    
    // Use tf.tidy to prevent memory leaks
    const result = tf.tidy(() => {
      // Normalize input
      const normalizedInput = this.normalizer!.predict(input) as tf.Tensor;
      
      // Get reconstruction
      const reconstruction = this.model!.predict(normalizedInput) as tf.Tensor;
      
      // Calculate reconstruction error
      const error = tf.metrics.meanSquaredError(normalizedInput, reconstruction).dataSync()[0];
      
      // Calculate anomaly confidence based on reconstruction error
      const confidence = Math.min(error * 10, 1) * 100;
      
      return {
        error,
        confidence
      };
    });

    // Clean up tensors
    input.dispose();

    return {
      isAnomaly: result.confidence > this.threshold * 100,
      confidence: result.confidence,
      reconstructionError: result.error
    };
  }

  async train(normalPackets: NetworkPacket[], epochs: number = 50) {
    if (!this.model || !this.normalizer) {
      throw new Error('Model not initialized');
    }

    const features = normalPackets.map(packet => [
      packet.bytesTransferred,
      packet.packetsPerSecond,
      packet.averagePacketSize,
      packet.connectionDuration,
      packet.portNumber,
      this.hashIPToNumber(packet.sourceIP) % 100
    ]);

    const trainingData = tf.tensor2d(features);

    // Train normalizer
    await this.normalizer.fit(trainingData, trainingData, {
      epochs: 10,
      validationSplit: 0.2
    });

    // Normalize training data
    const normalizedData = this.normalizer.predict(trainingData) as tf.Tensor;

    // Train autoencoder
    await this.model.fit(normalizedData, normalizedData, {
      epochs,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss.toFixed(4)}`);
        }
      }
    });

    // Clean up tensors
    trainingData.dispose();
    normalizedData.dispose();
  }
}