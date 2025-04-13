import { User } from '../domain/user';
import 'dotenv/config';
import { supabase } from '../utils/supabase.ts';
import { UserForm } from '../domain/interfaces/userForm';
import { UserFormSchemaType } from '../validations/schemas/userFormSchema.ts';

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
export async function insertUser(formData: UserForm): Promise<boolean | null> {
  console.log('createUser received formData:', formData); // デバッグ用ログ

  // ユーザーの作成
  const { error: userError } = await supabase.from('users').insert([
    {
      user_id: formData.user_id,
      name: formData.name,
      description: formData.description,
      github_id: formData.githubId,
      qiita_id: formData.qiitaId,
      x_id: formData.xId,
    },
  ]);

  if (userError) {
    console.error('ユーザー作成エラー:', userError);
    throw new Error('ユーザーの作成に失敗しました');
  }

  // スキルの一括登録処理
  if (!formData.skillIds || formData.skillIds.length === 0) {
    console.error('スキルIDが空です');
    throw new Error('スキルIDが空です');
  }

  const userSkillData = formData.skillIds.map((skillId) => ({
    user_id: formData.user_id,
    skill_id: skillId,
  }));

  console.log('userSkillData:', userSkillData); // デバッグ用ログ

  // スキルの登録
  const { error: skillError } = await supabase
    .from('user_skill')
    .insert(userSkillData);

  if (skillError) {
    console.error('スキル登録エラー:', skillError);
    // ロールバック: ユーザーを削除
    await supabase.from('users').delete().eq('user_id', formData.user_id);
    throw new Error('スキルの登録に失敗しました');
  }

  return true; // 成功時はtrueを返す
}
