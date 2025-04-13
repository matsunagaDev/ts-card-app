import { User } from '../domain/user';
// 'dotenv/config'のインポートを削除 - これはNode.js環境用であり、ブラウザでは動作しません
import { supabase } from '../utils/supabase';
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

// 単純にブール値を返す関数でさえエラーが発生していることから
// 関数呼び出し時に何らかの問題が起きている可能性があります
export async function getUserResponse(): Promise<void> {
  console.log('getUserResponse関数が実行されました');
  // 何も処理せず単にtrueを返す
}

// ユーザーを作成する
export async function insertUser(formData: UserForm): Promise<boolean> {
  console.log('insertUser関数に渡されたデータ:', formData); // デバッグ用ログ

  // const { user_id, name, description, skillIds } = formData;

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

  console.log('スキル登録データ:', userSkillData); // デバッグ用ログ

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
