import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { getUserSkillById } from '../lib/userSkill';

/**
 * モックの作成
 */
// Supabaseクライアントのモック
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      update: jest.fn().mockResolvedValue({ data: null, error: null }),
      delete: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  })),
}));

// ユーザーカード表示用
jest.mock('../lib/userSkill', () => ({
  getUserSkillById: jest.fn(),
  getUserSkillForEdit: jest.fn(),
}));

// ユーザーカード登録、更新用
jest.mock('../lib/user', () => ({
  insertUser: jest.fn().mockResolvedValue(true),
  updateUser: jest.fn().mockResolvedValue(true),
  getUserById: jest.fn().mockResolvedValue({
    user_id: 'testuser',
    name: 'テスト',
  }),
}));

/**
 * テストケース
 */
// タイトル表示
describe('App Component', () => {
  it('タイトルの表示', () => {
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    // タイトルの要素を取得
    const titleElement = screen.getByTestId('title');

    // アサーション
    expect(titleElement).toHaveTextContent('名刺アプリ');
  });
});

// 名刺カード表示
describe('UserCard Component', () => {
  afterEach(() => {
    // テスト後のクリーンアップ
    jest.resetAllMocks();
  });

  it('名刺カードの表示', async () => {
    // ユーザーイベントのセットアップ
    const user = userEvent.setup();

    // モックユーザーデータ
    const mockUser = {
      user_id: 'testuser',
      name: 'テストユーザー',
      description: '<p>これはテスト用の自己紹介です</p>',
      skills: [
        { id: '1', name: 'JavaScript' },
        { id: '2', name: 'React' },
      ],
      github_id: 'https://github.com/testuser',
      qiita_id: 'https://qiita.com/testuser',
      x_id: 'https://x.com/testuser',
      created_at: '2025-01-01 12:00:00',
    };

    // モック関数を設定
    (getUserSkillById as jest.Mock).mockResolvedValue(mockUser);

    // コンポーネントをレンダリング
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    // ホーム画面のID入力フィールドを探して入力
    const idInput = await waitFor(() => screen.getByTestId('id-input'));
    await user.type(idInput, 'testuser');

    //「名刺を見る」ボタンをクリック
    const viewButton = await waitFor(() => screen.getByTestId('view-button'));
    await user.click(viewButton);

    // 非同期処理が完了するのを待つ
    await waitFor(
      () => {
        expect(screen.queryByTestId('user-name')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // 自己紹介が表示されていることを確認
    await waitFor(() => {
      const userName = screen.queryByTestId('user-name');
      expect(userName).toBeInTheDocument();
    });

    // 各スキルが表示されていることを確認
    await waitFor(() => {
      expect(screen.queryByText('JavaScript')).toBeInTheDocument();
      expect(screen.queryByText('React')).toBeInTheDocument();
    });

    // GitHubアイコン、qiitaアイコン、xアイコンが表示されていることを確認
    await waitFor(() => {
      const githubIcon = screen.queryByTestId('github-icon');
      expect(githubIcon).toBeInTheDocument();
      const qiitaIcon = screen.queryByTestId('qiita-icon');
      expect(qiitaIcon).toBeInTheDocument();
      const xIcon = screen.queryByTestId('x-icon');
      expect(xIcon).toBeInTheDocument();
    });
  });
});
