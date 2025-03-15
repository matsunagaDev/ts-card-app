import { User } from '@/domain/user';
import 'dotenv/config';
import { supabase } from '../utils/supabase.ts';
import { UserSkill } from '@/domain/userSkill';

// 全てのユーザーを取得する
export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

// urlからユーザーを取得する
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

// ユーザーとユーザーに紐付くスキルを取得する
export async function getUserWithSkills(userId: string): Promise<User | null> {
  const user = await getUserById(userId);
  if (!user) {
    return null;
  }

  const { data: userSkills, error } = await supabase
    .from('user_skills')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    throw new Error(error.message);
  }

  const skills = userSkills.map((userSkill) => userSkill.skill_id);
  return { ...user, skills };
}
