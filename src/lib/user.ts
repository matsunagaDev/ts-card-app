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
  if (!formData) {
    throw new Error('フォームデータが不正です');
  }

  // トランザクション開始
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([
      {
        user_id: formData.user_id,
        name: formData.name,
        description: formData.description,
        github_id: formData.githubId || null,
        qiita_id: formData.qiitaId || null,
        x_id: formData.xId || null,
      },
    ])
    .select()
    .single();

  if (userError || !userData) {
    console.error('Error creating user:', userError);
    throw new Error('ユーザーの作成に失敗しました');
  }

  // スキルの登録
  const { error: skillError } = await supabase.from('user_skill').insert({
    user_id: formData.user_id,
    skill_id: formData.skillId,
  });

  if (skillError) {
    console.error('Error creating user skill:', skillError);
    // ユーザーの削除を試みる（ロールバック）
    await supabase.from('users').delete().eq('user_id', formData.user_id);
    throw new Error('スキルの登録に失敗しました');
  }

  return User.newUser(
    userData.user_id,
    userData.name,
    userData.description,
    [{ id: formData.skillId, name: '', created_at: '' }], // スキル情報は最小限
    userData.github_id,
    userData.qiita_id,
    userData.x_id,
    userData.created_at
  );
};
