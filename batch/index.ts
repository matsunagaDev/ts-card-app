import {
  deleteAllUsers,
  deleteAllUserSkills,
  deleteUsersCreatedBefore,
} from '../src/lib/user';

/**
 * ユーザーデータ全削除バッチ処理
 * GitHub Actionsで毎日実行され、データベースをクリーンアップ
 */
// export async function cleanupAllUserData() {
//   try {
//     // まずユーザースキルを削除（外部キー制約のため）
//     const skillDeleteResult = await deleteAllUserSkills();

//     if (!skillDeleteResult) {
//       throw new Error('ユーザースキルの削除に失敗しました');
//     }

//     // 次にユーザーデータを削除
//     const userDeleteResult = await deleteAllUsers();

//     if (!userDeleteResult) {
//       throw new Error('ユーザーの削除に失敗しました');
//     }
//   } catch (error) {
//     console.error('バッチ処理でエラーが発生しました:', error);
//     process.exit(1); // エラー終了
//   }
// }

// cleanupAllUserData()
//   .then(() => {
//     console.log('ユーザーデータのクリーンアップが完了しました');
//   })
//   .catch((error) => {
//     console.error('エラー:', error);
//   });

/**
 * 24時間以上前に登録されたユーザーデータを削除するバッチ処理
 * GitHub Actionsで毎日実行され、古いデータをクリーンアップ
 */
// export async function cleanupOldUserData() {
//   try {
//     console.log('バッチ処理を開始: 24時間以上前のユーザーデータ削除');

//     // 現在時刻から24時間前を計算
//     const twentyFourHoursAgo = new Date();
//     twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

//     console.log(`削除基準時刻（UTC）: ${twentyFourHoursAgo.toISOString()}`);
//     console.log(
//       `削除基準時刻（JST）: ${new Date(
//         twentyFourHoursAgo.getTime() + 9 * 60 * 60 * 1000
//       ).toISOString()}`
//     );

//     // 削除処理実行
//     const result = await deleteUsersCreatedBefore(twentyFourHoursAgo);

//     if (result) {
//       console.log('古いユーザーデータの削除に成功しました');
//     } else {
//       throw new Error('ユーザーデータの削除に失敗しました');
//     }
//   } catch (error) {
//     console.error('バッチ処理でエラーが発生しました:', error);
//     process.exit(1); // エラー終了
//   }
// }

// // スクリプト実行
// cleanupOldUserData()
//   .then(() => {
//     console.log('バッチ処理が完了しました');
//   })
//   .catch((error) => {
//     console.error('エラー:', error);
//     process.exit(1);
//   });

/**
 * 1時間以上前に登録されたユーザーデータを削除するバッチ処理（試験用）
 * 通常は24時間だが、動作確認のため1時間に短縮
 */
async function cleanupRecentUserData() {
  try {
    console.log('バッチ処理を開始: 1時間以上前のユーザーデータを削除');

    // 現在時刻から1時間前を計算
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    console.log(`削除基準時刻（UTC）: ${oneHourAgo.toISOString()}`);
    console.log(
      `削除基準時刻（JST）: ${new Date(
        oneHourAgo.getTime() + 9 * 60 * 60 * 1000
      ).toISOString()}`
    );

    // 削除処理実行
    const result = await deleteUsersCreatedBefore(oneHourAgo);

    if (result) {
      console.log('1時間以上前のユーザーデータの削除に成功しました');
    } else {
      throw new Error('ユーザーデータの削除に失敗しました');
    }
  } catch (error) {
    console.error('バッチ処理でエラーが発生しました:', error);
    process.exit(1); // エラー終了
  }
}

// スクリプト実行
cleanupRecentUserData()
  .then(() => {
    console.log('バッチ処理が完了しました');
  })
  .catch((error) => {
    console.error('エラー:', error);
    process.exit(1);
  });
