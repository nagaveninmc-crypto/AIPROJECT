import { Play, Square } from 'lucide-react';
import { EngagementSession } from '../lib/database.types';

interface SessionControlProps {
  activeSession: EngagementSession | null;
  onStartSession: () => void;
  onEndSession: () => void;
  isLoading: boolean;
}

export function SessionControl({
  activeSession,
  onStartSession,
  onEndSession,
  isLoading,
}: SessionControlProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Control</h2>

      {activeSession ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-900">Session Active</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{activeSession.session_name}</p>
            <p className="text-sm text-gray-600 mt-1">
              Started: {new Date(activeSession.start_time).toLocaleString()}
            </p>
          </div>

          <button
            onClick={onEndSession}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Square className="w-5 h-5" />
            End Session
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">No active session</p>
            <p className="text-xs text-gray-500 mt-1">
              Start a new session to begin monitoring student engagement
            </p>
          </div>

          <button
            onClick={onStartSession}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-5 h-5" />
            Start New Session
          </button>
        </div>
      )}
    </div>
  );
}
