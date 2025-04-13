import { Skill } from '../domain/skill';
import { supabase } from '../utils/supabase';

// Skillデータを全て取得する
export const AllSkills = async (): Promise<Skill[] | null> => {
  const { data, error } = await supabase.from('skills').select('*').order('id');

  if (error) {
    console.error('Error fetching skills:', error);
  }

  return data;
};
