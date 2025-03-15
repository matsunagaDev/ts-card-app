import { Outlet, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getAllUsers } from './lib/user';
import type { User } from './domain/user';
import { useToast } from '@chakra-ui/react';

export const Card = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      // ユーザー取得処理をPromiseでラップ
      const userPromise = new Promise(async (resolve, reject) => {
        try {
          const users = await getAllUsers();
          const foundUser = users.find((u) => u.user_id === id);
          if (foundUser) {
            setUser(foundUser);
            resolve(foundUser);
          } else {
            reject(new Error('User not found'));
          }
        } catch (error) {
          reject(error);
        }
      });

      // toast.promiseでユーザー取得の状態を表示
      toast.promise(userPromise, {
        success: {
          title: 'ユーザー情報取得完了',
          description: 'ユーザー情報の取得に成功しました',
        },
        error: {
          title: 'エラー発生',
          description: 'ユーザー情報の取得に失敗しました',
        },
        loading: {
          title: '読み込み中',
          description: 'ユーザー情報を取得しています',
        },
      });
    };

    fetchUser();
  }, [id, toast]);

  return (
    <div>
      <h1 data-testid="title">カード</h1>
      {user && (
        <div>
          <p>ID: {user.user_id}</p>
          <p>Name: {user.name}</p>
          <p>Description: {user.description}</p>
          <p>GitHub: {user.github_id}</p>
          <p>Qiita: {user.qiita_id}</p>
          <p>X: {user.x_id}</p>
          {/* 他のユーザー情報を表示 */}
        </div>
      )}
      <Outlet />
    </div>
  );
};
