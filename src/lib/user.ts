import { User } from '../domain/user';
import 'dotenv/config';
import { supabase } from '../utils/supabase.ts';
import { UserForm } from '../domain/interfaces/userForm';

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

// ユーザーを作成する
export const createUser = async (formData: UserForm): Promise<User> => {
  // トランザクション開始
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([
      {
        user_id: formData.user_id,
        name: formData.name,
        description: formData.description,
        github_id: formData.githubId,
        qiita_id: formData.qiitaId,
        x_id: formData.xId,
      },
    ])
    .select()
    .single();

  if (userError || !userData) {
    throw new Error('ユーザーの作成に失敗しました');
  }

  // スキルの一括登録
  const userSkillData = formData.skillIds.map((skillId) => ({
    user_id: formData.user_id,
    skill_id: skillId,
  }));

  const { error: skillError } = await supabase
    .from('user_skill')
    .insert(userSkillData);

  if (skillError) {
    // ロールバック: ユーザーを削除
    await supabase.from('users').delete().eq('user_id', formData.user_id);
    throw new Error('スキルの登録に失敗しました');
  }

  return userData;
};
