/*
  # AI Smart Classroom Monitor Schema

  ## Overview
  This migration creates the database schema for tracking student engagement in a classroom setting.
  The system monitors attention levels and participation to calculate overall engagement scores.

  ## New Tables
  
  ### 1. `students`
  Stores student information for the classroom
  - `id` (uuid, primary key) - Unique identifier for each student
  - `student_id` (text, unique) - Student's ID number
  - `name` (text) - Student's full name
  - `class_section` (text) - Class section or grade
  - `created_at` (timestamptz) - When the student was added to the system
  
  ### 2. `engagement_sessions`
  Tracks monitoring sessions (e.g., a class period or lecture)
  - `id` (uuid, primary key) - Unique identifier for each session
  - `session_name` (text) - Name/title of the session
  - `start_time` (timestamptz) - When the session started
  - `end_time` (timestamptz, nullable) - When the session ended
  - `status` (text) - Current status: 'active', 'completed', 'paused'
  - `created_at` (timestamptz) - Session creation timestamp
  
  ### 3. `engagement_metrics`
  Records engagement data points for students during sessions
  - `id` (uuid, primary key) - Unique identifier
  - `student_id` (uuid, foreign key) - References students table
  - `session_id` (uuid, foreign key) - References engagement_sessions table
  - `attention_score` (integer) - Attention level (0-100)
  - `participation_score` (integer) - Participation level (0-100)
  - `overall_score` (integer) - Calculated overall engagement (0-100)
  - `head_position` (text) - Head orientation data
  - `eye_contact` (boolean) - Whether eye contact detected
  - `timestamp` (timestamptz) - When this metric was recorded
  - `notes` (text, nullable) - Additional observations

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage all data
  - Public read access for dashboard viewing
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text UNIQUE NOT NULL,
  name text NOT NULL,
  class_section text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create engagement_sessions table
CREATE TABLE IF NOT EXISTS engagement_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_name text NOT NULL,
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Create engagement_metrics table
CREATE TABLE IF NOT EXISTS engagement_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  session_id uuid REFERENCES engagement_sessions(id) ON DELETE CASCADE,
  attention_score integer DEFAULT 0,
  participation_score integer DEFAULT 0,
  overall_score integer DEFAULT 0,
  head_position text DEFAULT 'center',
  eye_contact boolean DEFAULT true,
  timestamp timestamptz DEFAULT now(),
  notes text
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_student_id ON engagement_metrics(student_id);
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_session_id ON engagement_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_timestamp ON engagement_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_engagement_sessions_status ON engagement_sessions(status);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_metrics ENABLE ROW LEVEL SECURITY;

-- Students policies - Allow public read for dashboard
CREATE POLICY "Allow public read access to students"
  ON students FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on students"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on students"
  ON students FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on students"
  ON students FOR DELETE
  TO authenticated
  USING (true);

-- Engagement sessions policies
CREATE POLICY "Allow public read access to sessions"
  ON engagement_sessions FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on sessions"
  ON engagement_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on sessions"
  ON engagement_sessions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on sessions"
  ON engagement_sessions FOR DELETE
  TO authenticated
  USING (true);

-- Engagement metrics policies
CREATE POLICY "Allow public read access to metrics"
  ON engagement_metrics FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on metrics"
  ON engagement_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on metrics"
  ON engagement_metrics FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on metrics"
  ON engagement_metrics FOR DELETE
  TO authenticated
  USING (true);