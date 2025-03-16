import { User } from '../domain/user';
import { supabase } from '../utils/supabase';

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

  const userData = User.newUser(
    data.user_id,
    data.name,
    data.description,
    skills, // 変換したスキルデータを渡す
    data.github_id,
    data.qiita_id,
    data.x_id,
    data.created_at
  );

  return userData;
}
