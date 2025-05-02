import { deleteUsersCreatedBefore } from '../src/lib/user';

/**
 * 24時間以上前に登録されたユーザーデータを削除するバッチ処理
 */
async function cleanupOldUserData() {
  try {
    console.log('バッチ処理を開始: 24時間以上前のユーザーデータ削除');

    // 現在時刻から24時間前を計算
    const dayAgo = new Date();
    dayAgo.setHours(dayAgo.getHours() - 24);

    // タイムゾーンの差を確認するためにログ出力
    console.log(`削除基準時刻（UTC）: ${dayAgo.toISOString()}`);
    console.log(
      `削除基準時刻（JST）: ${new Date(
        dayAgo.getTime() + 9 * 60 * 60 * 1000
      ).toISOString()}`
    );

    // 削除処理実行
    const result = await deleteUsersCreatedBefore(dayAgo);

    if (result) {
      console.log('ユーザーデータの削除に成功しました');
    } else {
      throw new Error('ユーザーデータの削除に失敗しました');
    }
  } catch (error) {
    console.error('バッチ処理でエラーが発生しました:', error);
    process.exit(1); // エラー終了
  }
}

// スクリプト実行
cleanupOldUserData()
  .then(() => {
    console.log('バッチ処理が完了しました');
    process.exit(0); // 正常終了
  })
  .catch((error) => {
    console.error('エラー:', error);
    process.exit(1); // エラー終了
  });
