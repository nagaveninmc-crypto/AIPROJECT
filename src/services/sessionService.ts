import { supabase } from '../lib/supabase';
import { EngagementSession } from '../lib/database.types';

export async function createSession(sessionName: string): Promise<EngagementSession> {
  const { data, error } = await supabase
    .from('engagement_sessions')
    .insert({ session_name: sessionName, status: 'active' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getActiveSession(): Promise<EngagementSession | null> {
  const { data, error } = await supabase
    .from('engagement_sessions')
    .select('*')
    .eq('status', 'active')
    .order('start_time', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function endSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('engagement_sessions')
    .update({ status: 'completed', end_time: new Date().toISOString() })
    .eq('id', sessionId);

  if (error) throw error;
}

export async function getAllSessions(): Promise<EngagementSession[]> {
  const { data, error } = await supabase
    .from('engagement_sessions')
    .select('*')
    .order('start_time', { ascending: false });

  if (error) throw error;
  return data || [];
}
