import { User } from '../domain/user';
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
    return null;
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

// ユーザーを更新する
export async function updateUser(formData: UserForm): Promise<boolean> {
  try {
    // ユーザーの更新
    const { error: userError } = await supabase
      .from('users')
      .update({
        name: formData.name,
        description: formData.description,
        github_id: formData.githubId,
        qiita_id: formData.qiitaId,
        x_id: formData.xId,
      })
      .eq('user_id', formData.user_id);

    if (userError) {
      console.error('ユーザー更新エラー:', userError);
      return false; // エラー時はfalseを返す
    }

    // 既存のスキルを削除
    const { error: deleteSkillError } = await supabase
      .from('user_skill')
      .delete()
      .eq('user_id', formData.user_id);

    if (deleteSkillError) {
      console.error('既存スキル削除エラー:', deleteSkillError);
      return false; // エラー時はfalseを返す
    }

    // スキルの情報が存在する場合のみ新たに登録する
    if (formData.skillIds && formData.skillIds.length > 0) {
      const userSkillData = formData.skillIds.map((skillId) => ({
        user_id: formData.user_id,
        skill_id: skillId,
      }));

      // 新しいスキルを登録
      const { error: skillError } = await supabase
        .from('user_skill')
        .insert(userSkillData);

      if (skillError) {
        console.error('スキル登録エラー:', skillError);
        return false; // エラー時はfalseを返す
      }
    }

    return true; // 成功時はtrueを返す
  } catch (error) {
    console.error('予期しないエラーが発生しました:', error);
    return false; // 例外発生時もfalseを返す
  }
}

// ユーザーを削除する
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    // まず子テーブル（user_skill）からデータを削除
    const { error: skillError } = await supabase
      .from('user_skill')
      .delete()
      .eq('user_id', userId);

    if (skillError) {
      console.error('スキル削除エラー:', skillError);
      return false; // エラー時はfalseを返す
    }

    // 次に親テーブル（users）からデータを削除
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('user_id', userId);

    if (userError) {
      console.error('ユーザー削除エラー:', userError);
      return false; // エラー時はfalseを返す
    }

    return true; // 成功時はtrueを返す
  } catch (error) {
    console.error('予期しないエラーが発生しました:', error);
    return false; // 例外発生時もfalseを返す
  }
}

/**
 * バッチ処理用の関数
 * ユーザーを一括削除する
 */

// ユーザーの全削除（バッチ処理用）
export async function deleteAllUsers(): Promise<boolean> {
  try {
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .neq('user_id', ''); // user_idが空でないユーザーを削除

    if (userError) {
      console.error('ユーザー全削除エラー:', userError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('予期しないエラーが発生しました:', error);
    return false;
  }
}

// ユーザーの保持するスキルを全削除（バッチ処理用）
export async function deleteAllUserSkills(): Promise<boolean> {
  try {
    const { error: skillError } = await supabase
      .from('user_skill')
      .delete()
      .neq('user_id', ''); // user_idが空でないユーザーのスキルを削除

    if (skillError) {
      console.error('ユーザー全スキル削除エラー:', skillError);
      return false;
    }
    return true;
  } catch (error) {
    console.error('予期しないエラーが発生しました:', error);
    return false;
  }
}
