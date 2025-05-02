import { deleteAllUsers, deleteAllUserSkills } from '../src/lib/user';

/**
 * ユーザーデータ全削除バッチ処理
 * GitHub Actionsで毎日実行され、データベースをクリーンアップ
 */
export async function cleanupAllUserData() {
  try {
    // まずユーザースキルを削除（外部キー制約のため）
    const skillDeleteResult = await deleteAllUserSkills();

    if (!skillDeleteResult) {
      throw new Error('ユーザースキルの削除に失敗しました');
    }

    // 次にユーザーデータを削除
    const userDeleteResult = await deleteAllUsers();

    if (!userDeleteResult) {
      throw new Error('ユーザーの削除に失敗しました');
    }
  } catch (error) {
    console.error('バッチ処理でエラーが発生しました:', error);
    process.exit(1); // エラー終了
  }
}

cleanupAllUserData()
  .then(() => {
    console.log('ユーザーデータのクリーンアップが完了しました');
  })
  .catch((error) => {
    console.error('エラー:', error);
  });
//     .delete()
