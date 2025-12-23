import { supabase } from '../lib/supabase';
import { EngagementMetric } from '../lib/database.types';
import { EngagementData } from '../lib/engagementDetection';

export async function recordMetric(
  studentId: string,
  sessionId: string,
  engagementData: EngagementData
): Promise<EngagementMetric> {
  const { data, error } = await supabase
    .from('engagement_metrics')
    .insert({
      student_id: studentId,
      session_id: sessionId,
      attention_score: engagementData.attentionScore,
      participation_score: engagementData.participationScore,
      overall_score: engagementData.overallScore,
      head_position: engagementData.headPosition,
      eye_contact: engagementData.eyeContact,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMetricsForSession(sessionId: string): Promise<EngagementMetric[]> {
  const { data, error } = await supabase
    .from('engagement_metrics')
    .select('*')
    .eq('session_id', sessionId)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getLatestMetricForStudent(
  studentId: string,
  sessionId: string
): Promise<EngagementMetric | null> {
  const { data, error } = await supabase
    .from('engagement_metrics')
    .select('*')
    .eq('student_id', studentId)
    .eq('session_id', sessionId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getAverageScoreForStudent(
  studentId: string,
  sessionId: string
): Promise<{ attention: number; participation: number; overall: number }> {
  const { data, error } = await supabase
    .from('engagement_metrics')
    .select('attention_score, participation_score, overall_score')
    .eq('student_id', studentId)
    .eq('session_id', sessionId);

  if (error) throw error;

  if (!data || data.length === 0) {
    return { attention: 0, participation: 0, overall: 0 };
  }

  const sum = data.reduce(
    (acc, metric) => ({
      attention: acc.attention + metric.attention_score,
      participation: acc.participation + metric.participation_score,
      overall: acc.overall + metric.overall_score,
    }),
    { attention: 0, participation: 0, overall: 0 }
  );

  return {
    attention: Math.round(sum.attention / data.length),
    participation: Math.round(sum.participation / data.length),
    overall: Math.round(sum.overall / data.length),
  };
}
