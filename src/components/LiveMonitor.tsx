import { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Video } from 'lucide-react';
import { engagementDetector, EngagementData } from '../lib/engagementDetection';

interface LiveMonitorProps {
  onEngagementUpdate?: (data: EngagementData) => void;
}

export function LiveMonitor({ onEngagementUpdate }: LiveMonitorProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestData, setLatestData] = useState<EngagementData | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (isCameraActive) {
        stopCamera();
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      await engagementDetector.startCamera();
      if (videoRef.current) {
        engagementDetector.setVideoElement(videoRef.current);
      }

      engagementDetector.startDetection((data) => {
        setLatestData(data);
        onEngagementUpdate?.(data);
      }, 3000);

      setIsCameraActive(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to access camera. Please check permissions.'
      );
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    engagementDetector.stopDetection();
    engagementDetector.stopCamera();
    setIsCameraActive(false);
    setLatestData(null);
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Video className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Live Monitor</h2>
        </div>
        <button
          onClick={toggleCamera}
          className={`${
            isCameraActive
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors`}
        >
          {isCameraActive ? (
            <>
              <CameraOff className="w-5 h-5" />
              Stop Camera
            </>
          ) : (
            <>
              <Camera className="w-5 h-5" />
              Start Camera
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '360px' }}>
        {isCameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {latestData && (
              <div className="absolute top-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-300">Attention</div>
                    <div className="text-2xl font-bold">{latestData.attentionScore}%</div>
                  </div>
                  <div>
                    <div className="text-gray-300">Participation</div>
                    <div className="text-2xl font-bold">{latestData.participationScore}%</div>
                  </div>
                  <div>
                    <div className="text-gray-300">Eye Contact</div>
                    <div className="font-medium">{latestData.eyeContact ? 'Yes' : 'No'}</div>
                  </div>
                  <div>
                    <div className="text-gray-300">Head Position</div>
                    <div className="font-medium capitalize">{latestData.headPosition}</div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Camera className="w-16 h-16 mb-4" />
            <p className="text-lg">Camera is off</p>
            <p className="text-sm mt-1">Click "Start Camera" to begin live monitoring</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p className="font-medium mb-1">How it works:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Camera analyzes facial positioning and attention levels</li>
          <li>AI algorithms calculate engagement scores in real-time</li>
          <li>Data is used to improve overall classroom monitoring</li>
        </ul>
      </div>
    </div>
  );
}
