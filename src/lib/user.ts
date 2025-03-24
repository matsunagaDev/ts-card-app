import { User } from '@/domain/user';
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
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([
      {
        name: formData.name,
        description: formData.description,
        github_id: formData.githubId,
        qiita_id: formData.qiitaId,
        x_id: formData.xId,
      },
    ])
    .select()
    .single();

  if (userError) throw userError;

  // UserSkillの登録
  const { error: skillError } = await supabase.from('user_skills').insert([
    {
      user_id: userData.id,
      skill_id: formData.skillId,
    },
  ]);

  if (skillError) throw skillError;

  return User.newUser(
    userData.id,
    userData.name,
    userData.description,
    [], // skills は後で取得
    userData.github_id,
    userData.qiita_id,
    userData.x_id,
    userData.created_at
  );
};

export const updateUser = async (formData: UserForm): Promise<User> => {
  // 既存のユーザーを更新
  const { data: userData, error: userError } = await supabase
    .from('users')
    .update({
      name: formData.name,
      description: formData.description,
      github_id: formData.githubId,
      qiita_id: formData.qiitaId,
      x_id: formData.xId,
    })
    .eq('id', formData.id)
    .select()
    .single();

  if (userError) throw userError;

  // スキルの更新が必要な場合
  if (formData.skillId) {
    const { error: skillError } = await supabase
      .from('user_skills')
      .update({ skill_id: formData.skillId })
      .eq('user_id', formData.id);

    if (skillError) throw skillError;
  }

  return User.newUser(
    userData.id,
    userData.name,
    userData.description,
    [], // スキルは別途取得
    userData.github_id,
    userData.qiita_id,
    userData.x_id,
    userData.created_at
  );
};
