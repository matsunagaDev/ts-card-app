import { deleteUsersByDateRange } from '../src/lib/user';

/**
 * 前日に登録されたユーザーデータを削除するバッチ処理
 */
async function cleanupYesterdayUserData() {
  try {
    console.log('バッチ処理を開始: 前日登録ユーザーデータの削除');

    const yesterday = new Date();
    // 前日の日付を取得
    yesterday.setDate(yesterday.getDate() - 1);

    // 前日の00:00:00を設定
    const startDate = new Date(yesterday);
    startDate.setHours(0, 0, 0, 0);

    // 前日の23:59:59を設定
    const endDate = new Date(yesterday);
    endDate.setHours(23, 59, 59, 999);

    // 削除処理実行
    const result = await deleteUsersByDateRange(startDate, endDate);

    if (result) {
      console.log('前日のユーザーデータの削除に成功しました');
    } else {
      throw new Error('ユーザーデータの削除に失敗しました');
    }
  } catch (error) {
    console.error('バッチ処理でエラーが発生しました:', error);
    process.exit(1); // エラー終了
  }
}

// スクリプト実行
cleanupYesterdayUserData()
  .then(() => {
    console.log('バッチ処理が完了しました');
    process.exit(0); // 正常終了
  })
  .catch((error) => {
    console.error('エラー:', error);
    process.exit(1); // エラー終了
  });
