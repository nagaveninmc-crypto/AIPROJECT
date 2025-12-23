import { Student } from '../lib/database.types';
import { Eye, UserCircle } from 'lucide-react';

interface EngagementCardProps {
  student: Student;
  attentionScore: number;
  participationScore: number;
  overallScore: number;
  eyeContact: boolean;
  headPosition: string;
}

export function EngagementCard({
  student,
  attentionScore,
  participationScore,
  overallScore,
  eyeContact,
  headPosition,
}: EngagementCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <UserCircle className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-500">ID: {student.student_id}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full ${getScoreBg(overallScore)}`}>
          <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Attention</span>
            <span className={`font-semibold ${getScoreColor(attentionScore)}`}>
              {attentionScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                attentionScore >= 80
                  ? 'bg-green-500'
                  : attentionScore >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${attentionScore}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Participation</span>
            <span className={`font-semibold ${getScoreColor(participationScore)}`}>
              {participationScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                participationScore >= 80
                  ? 'bg-green-500'
                  : participationScore >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${participationScore}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Eye className={`w-4 h-4 ${eyeContact ? 'text-green-500' : 'text-gray-400'}`} />
          <span className="text-gray-600">Eye Contact</span>
        </div>
        <div className="text-gray-600">
          Head: <span className="font-medium capitalize">{headPosition}</span>
        </div>
      </div>
    </div>
  );
}
