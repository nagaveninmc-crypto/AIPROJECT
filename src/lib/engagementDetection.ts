export interface EngagementData {
  attentionScore: number;
  participationScore: number;
  overallScore: number;
  headPosition: string;
  eyeContact: boolean;
}

export class EngagementDetector {
  private videoElement: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private detectionInterval: number | null = null;
  private lastFaceDetectionTime: number = Date.now();

  async startCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false,
      });

      if (this.videoElement) {
        this.videoElement.srcObject = this.stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      throw new Error('Unable to access camera. Please grant camera permissions.');
    }
  }

  setVideoElement(video: HTMLVideoElement): void {
    this.videoElement = video;
    if (this.stream) {
      video.srcObject = this.stream;
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
  }

  startDetection(callback: (data: EngagementData) => void, intervalMs: number = 3000): void {
    this.detectionInterval = window.setInterval(() => {
      const data = this.analyzeEngagement();
      callback(data);
    }, intervalMs);
  }

  stopDetection(): void {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
  }

  private analyzeEngagement(): EngagementData {
    const baseAttention = Math.floor(Math.random() * 30) + 60;
    const baseParticipation = Math.floor(Math.random() * 40) + 50;

    const headPositions = ['center', 'left', 'right', 'down'];
    const headPosition = headPositions[Math.floor(Math.random() * headPositions.length)];

    const eyeContact = Math.random() > 0.3;

    let attentionScore = baseAttention;
    if (headPosition === 'center' && eyeContact) {
      attentionScore += 20;
    } else if (headPosition === 'down') {
      attentionScore -= 20;
    }

    attentionScore = Math.max(0, Math.min(100, attentionScore));

    const movementBonus = Math.floor(Math.random() * 15);
    let participationScore = baseParticipation + movementBonus;
    participationScore = Math.max(0, Math.min(100, participationScore));

    const overallScore = Math.round((attentionScore * 0.6 + participationScore * 0.4));

    return {
      attentionScore,
      participationScore,
      overallScore,
      headPosition,
      eyeContact,
    };
  }

  generateMockEngagement(): EngagementData {
    return this.analyzeEngagement();
  }
}

export const engagementDetector = new EngagementDetector();
