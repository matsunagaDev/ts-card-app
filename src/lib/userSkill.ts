import { User } from '../domain/user';
import { supabase } from '../utils/supabase';

// 表示用のユーザー情報取得（URLフォーマット）
export async function getUserSkillById(userId: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select(
      `
      *,
      user_skill (
        skills (
          id,
          name
        )
      )
    `
    )
    .eq('user_id', userId)
    .limit(1)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // スキルデータを適切な形に変換
  const skills =
    data.user_skill?.map((relation: any) => ({
      id: relation.skills.id,
      name: relation.skills.name,
    })) || [];

  console.log('変換後のスキルデータ:', skills);

  // 表示用：URL形式のSNSアカウント
  const userData = User.newUser(
    data.user_id,
    data.name,
    data.description,
    skills,
    data.github_id,
    data.qiita_id,
    data.x_id,
    data.created_at
  );

  return userData;
}

// 編集用のユーザー情報取得（ID部分のみ）
export async function getUserSkillForEdit(userId: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select(
      `
      *,
      user_skill (
        skill_id,
        skills (
          id,
          name
        )
      )
    `
    )
    .eq('user_id', userId)
    .limit(1)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // スキルデータを適切な形に変換
  const skills =
    data.user_skill?.map((relation: any) => ({
      id: relation.skills.id,
      name: relation.skills.name,
    })) || [];

  // スキルIDのリストを作成（編集フォームのデフォルト値用）
  const skillIds =
    data.user_skill?.map((item: any) => Number(item.skill_id)) || [];
  console.log('変換後のスキルID:', skillIds);

  // 編集用：IDのみのフォーマット
  const userData = {
    user_id: data.user_id,
    name: data.name,
    description: data.description,
    skills: skills,
    github_id: data.github_id,
    qiita_id: data.qiita_id,
    x_id: data.x_id,
    created_at: data.created_at,
  };

  return userData;
}
