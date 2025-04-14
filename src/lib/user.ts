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

// ユーザーの重複チェックを行う
export async function checkUserExists(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_id', userId);

    if (error) {
      console.error('ユーザー重複チェックエラー:', error);
      throw error; // エラーを呼び出し元に伝播
    }

    // データが存在する場合（配列の長さが0より大きい）、trueを返す
    return Array.isArray(data) && data.length > 0;
  } catch (error) {
    console.error('ユーザー重複チェックでエラーが発生:', error);
    throw error; // エラーを呼び出し元に伝播
  }
}

// ユーザーを作成する
export async function insertUser(formData: UserForm): Promise<boolean> {
  try {
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
      return false; // エラー時はfalseを返す
    }

    // スキルの一括登録処理
    if (!formData.skillIds || formData.skillIds.length === 0) {
      console.error('スキルIDが空です');
      return false; // エラー時はfalseを返す
    }

    const userSkillData = formData.skillIds.map((skillId) => ({
      user_id: formData.user_id,
      skill_id: skillId,
    }));

    // スキルの登録
    const { error: skillError } = await supabase
      .from('user_skill')
      .insert(userSkillData);

    if (skillError) {
      console.error('スキル登録エラー:', skillError);
      // ロールバック: ユーザーを削除
      await supabase.from('users').delete().eq('user_id', formData.user_id);
      return false; // エラー時はfalseを返す
    }

    return true; // 成功時はtrueを返す
  } catch (error) {
    console.error('予期しないエラーが発生しました:', error);
    // トランザクションが途中で失敗した場合に備えて、ロールバック処理を試みる
    try {
      await supabase.from('users').delete().eq('user_id', formData.user_id);
    } catch (rollbackError) {
      console.error('ロールバック処理に失敗しました:', rollbackError);
    }
    return false; // 例外発生時もfalseを返す
  }
}
