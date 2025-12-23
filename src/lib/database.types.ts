export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          student_id: string;
          name: string;
          class_section: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          name: string;
          class_section?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          name?: string;
          class_section?: string;
          created_at?: string;
        };
      };
      engagement_sessions: {
        Row: {
          id: string;
          session_name: string;
          start_time: string;
          end_time: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_name: string;
          start_time?: string;
          end_time?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_name?: string;
          start_time?: string;
          end_time?: string | null;
          status?: string;
          created_at?: string;
        };
      };
      engagement_metrics: {
        Row: {
          id: string;
          student_id: string;
          session_id: string;
          attention_score: number;
          participation_score: number;
          overall_score: number;
          head_position: string;
          eye_contact: boolean;
          timestamp: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          session_id: string;
          attention_score?: number;
          participation_score?: number;
          overall_score?: number;
          head_position?: string;
          eye_contact?: boolean;
          timestamp?: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          student_id?: string;
          session_id?: string;
          attention_score?: number;
          participation_score?: number;
          overall_score?: number;
          head_position?: string;
          eye_contact?: boolean;
          timestamp?: string;
          notes?: string | null;
        };
      };
    };
  };
}

export type Student = Database['public']['Tables']['students']['Row'];
export type EngagementSession = Database['public']['Tables']['engagement_sessions']['Row'];
export type EngagementMetric = Database['public']['Tables']['engagement_metrics']['Row'];
