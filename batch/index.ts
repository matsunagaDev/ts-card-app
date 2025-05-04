import { deleteUsersByDateRange } from '../src/lib/user';

/**
 * 前日に登録されたユーザーデータを削除するバッチ処理
 * 日本時間基準で前日のデータを削除
 */
async function cleanupYesterdayUserData() {
  try {
    console.log('バッチ処理を開始: 日本時間で前日登録したユーザーデータの削除');

    // 現在の日本時間を取得（UTC+9時間）
    const now = new Date();
    const jstOffset = 9 * 60 * 60 * 1000; // JST時差: 9時間をミリ秒で
    const jstNow = new Date(now.getTime() + jstOffset);

    // 日本時間での前日の日付
    const jstYesterday = new Date(jstNow);
    jstYesterday.setDate(jstYesterday.getDate() - 1);

    // 日本時間の前日00:00:00
    const jstStartDate = new Date(jstYesterday);
    jstStartDate.setHours(0, 0, 0, 0);

    // 日本時間の前日23:59:59
    const jstEndDate = new Date(jstYesterday);
    jstEndDate.setHours(23, 59, 59, 999);

    // JSTからUTCに変換（-9時間）
    const utcStartDate = new Date(jstStartDate.getTime() - jstOffset);
    const utcEndDate = new Date(jstEndDate.getTime() - jstOffset);

    console.log(
      `削除期間（日本時間）: ${jstStartDate.toLocaleString(
        'ja-JP'
      )} から ${jstEndDate.toLocaleString('ja-JP')}`
    );
    console.log(
      `削除期間（UTC）: ${utcStartDate.toISOString()} から ${utcEndDate.toISOString()}`
    );

    // 削除処理実行（UTCタイムスタンプで検索）
    const result = await deleteUsersByDateRange(utcStartDate, utcEndDate);

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
