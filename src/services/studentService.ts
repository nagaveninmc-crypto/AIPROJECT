import { supabase } from '../lib/supabase';
import { Student } from '../lib/database.types';

export async function getAllStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createStudent(
  studentId: string,
  name: string,
  classSection: string
): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .insert({ student_id: studentId, name, class_section: classSection })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteStudent(id: string): Promise<void> {
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) throw error;
}
