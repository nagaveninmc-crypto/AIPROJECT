import { useState, useEffect } from 'react';
import { EngagementCard } from './EngagementCard';
import { SessionControl } from './SessionControl';
import { AddStudentModal } from './AddStudentModal';
import { Student, EngagementSession } from '../lib/database.types';
import { getAllStudents, createStudent, deleteStudent } from '../services/studentService';
import {
  createSession,
  getActiveSession,
  endSession as endSessionService,
} from '../services/sessionService';
import { recordMetric, getAverageScoreForStudent } from '../services/metricsService';
import { engagementDetector } from '../lib/engagementDetection';
import { Users, Plus, Trash2, Activity } from 'lucide-react';

interface StudentEngagement {
  student: Student;
  attentionScore: number;
  participationScore: number;
  overallScore: number;
  eyeContact: boolean;
  headPosition: string;
}

export function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeSession, setActiveSession] = useState<EngagementSession | null>(null);
  const [studentEngagements, setStudentEngagements] = useState<Map<string, StudentEngagement>>(
    new Map()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [monitoringInterval, setMonitoringInterval] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeSession && students.length > 0) {
      startMonitoring();
    } else {
      stopMonitoring();
    }

    return () => stopMonitoring();
  }, [activeSession, students]);

  const loadData = async () => {
    try {
      const [studentsData, sessionData] = await Promise.all([
        getAllStudents(),
        getActiveSession(),
      ]);

      setStudents(studentsData);
      setActiveSession(sessionData);

      if (sessionData && studentsData.length > 0) {
        const engagements = new Map<string, StudentEngagement>();
        for (const student of studentsData) {
          const avg = await getAverageScoreForStudent(student.id, sessionData.id);
          engagements.set(student.id, {
            student,
            attentionScore: avg.attention || 70,
            participationScore: avg.participation || 75,
            overallScore: avg.overall || 72,
            eyeContact: true,
            headPosition: 'center',
          });
        }
        setStudentEngagements(engagements);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const startMonitoring = () => {
    if (monitoringInterval) return;

    const interval = window.setInterval(async () => {
      if (!activeSession) return;

      const updatedEngagements = new Map(studentEngagements);

      for (const student of students) {
        const engagementData = engagementDetector.generateMockEngagement();

        try {
          await recordMetric(student.id, activeSession.id, engagementData);

          updatedEngagements.set(student.id, {
            student,
            attentionScore: engagementData.attentionScore,
            participationScore: engagementData.participationScore,
            overallScore: engagementData.overallScore,
            eyeContact: engagementData.eyeContact,
            headPosition: engagementData.headPosition,
          });
        } catch (error) {
          console.error('Error recording metric:', error);
        }
      }

      setStudentEngagements(updatedEngagements);
    }, 5000);

    setMonitoringInterval(interval);
  };

  const stopMonitoring = () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      setMonitoringInterval(null);
    }
  };

  const handleStartSession = async () => {
    setIsLoading(true);
    try {
      const sessionName = `Session ${new Date().toLocaleString()}`;
      const session = await createSession(sessionName);
      setActiveSession(session);
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Failed to start session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!activeSession) return;

    setIsLoading(true);
    try {
      await endSessionService(activeSession.id);
      setActiveSession(null);
      setStudentEngagements(new Map());
    } catch (error) {
      console.error('Error ending session:', error);
      alert('Failed to end session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (studentId: string, name: string, classSection: string) => {
    try {
      const newStudent = await createStudent(studentId, name, classSection);
      setStudents([...students, newStudent]);

      if (activeSession) {
        const engagementData = engagementDetector.generateMockEngagement();
        setStudentEngagements(
          new Map(studentEngagements).set(newStudent.id, {
            student: newStudent,
            attentionScore: engagementData.attentionScore,
            participationScore: engagementData.participationScore,
            overallScore: engagementData.overallScore,
            eyeContact: engagementData.eyeContact,
            headPosition: engagementData.headPosition,
          })
        );
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student. Student ID may already exist.');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await deleteStudent(id);
      setStudents(students.filter((s) => s.id !== id));
      const newEngagements = new Map(studentEngagements);
      newEngagements.delete(id);
      setStudentEngagements(newEngagements);
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };

  const overallClassScore =
    studentEngagements.size > 0
      ? Math.round(
          Array.from(studentEngagements.values()).reduce(
            (sum, eng) => sum + eng.overallScore,
            0
          ) / studentEngagements.size
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Smart Classroom Monitor</h1>
          </div>
          <p className="text-gray-600">Real-time student engagement tracking and analytics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Students ({students.length})
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Student
                </button>
              </div>

              {activeSession && overallClassScore > 0 && (
                <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Overall Class Engagement
                    </span>
                    <span className="text-3xl font-bold text-blue-600">{overallClassScore}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 mt-2">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                      style={{ width: `${overallClassScore}%` }}
                    />
                  </div>
                </div>
              )}

              {students.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No students added yet</p>
                  <p className="text-sm text-gray-400 mt-1">Click "Add Student" to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {students.map((student) => {
                    const engagement = studentEngagements.get(student.id);
                    return (
                      <div key={student.id} className="relative group">
                        <EngagementCard
                          student={student}
                          attentionScore={engagement?.attentionScore || 0}
                          participationScore={engagement?.participationScore || 0}
                          overallScore={engagement?.overallScore || 0}
                          eyeContact={engagement?.eyeContact || false}
                          headPosition={engagement?.headPosition || 'center'}
                        />
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg"
                          title="Delete student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <SessionControl
              activeSession={activeSession}
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddStudent}
      />
    </div>
  );
}
