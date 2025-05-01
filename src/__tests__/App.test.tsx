import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { getUserSkillById } from '../lib/userSkill';

/**
 * モックの設定
 * - Supabase API: データベースとのやり取りをモック化
 * - ユーザースキル関連API: カード表示に必要なデータ取得をモック化
 * - ユーザー登録・更新API: ユーザーデータ操作をモック化
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

// ユーザーカード表示用API
jest.mock('../lib/userSkill', () => ({
  getUserSkillById: jest.fn(),
  getUserSkillForEdit: jest.fn(),
}));

// ユーザーカード登録、更新用API
jest.mock('../lib/user', () => ({
  insertUser: jest.fn().mockResolvedValue(true),
  updateUser: jest.fn().mockResolvedValue(true),
  getUserById: jest.fn().mockResolvedValue({
    user_id: 'testuser',
    name: 'テスト',
  }),
}));

// アプリ全体の基本機能テスト
describe('App Component', () => {
  it('タイトルが正しく表示される', () => {
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const titleElement = screen.getByTestId('title');
    expect(titleElement).toHaveTextContent('名刺アプリ');
  });
});

// ユーザーカード表示機能のテスト
describe('UserCard Component', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('IDを入力して名刺カードが正しく表示される', async () => {
    // テストユーザー操作の準備
    const user = userEvent.setup();

    // テスト用のユーザーデータを設定
    const mockUserData = {
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

    // モック関数の戻り値を設定
    (getUserSkillById as jest.Mock).mockResolvedValue(mockUserData);

    // アプリをレンダリング
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    // ホーム画面でIDを入力
    const idInput = await waitFor(() => screen.getByTestId('id-input'));
    await user.type(idInput, 'testuser');

    // 「名刺を見る」ボタンをクリック
    const viewButton = await waitFor(() => screen.getByTestId('view-button'));
    await user.click(viewButton);

    // ユーザー名が表示されることを確認
    await waitFor(
      () => {
        expect(screen.queryByTestId('user-name')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // 自己紹介が表示されることを確認
    await waitFor(() => {
      const userName = screen.queryByTestId('user-name');
      expect(userName).toBeInTheDocument();
    });

    // スキルが表示されることを確認
    await waitFor(() => {
      expect(screen.queryByText('JavaScript')).toBeInTheDocument();
      expect(screen.queryByText('React')).toBeInTheDocument();
    });

    // SNSアイコンが表示されることを確認
    await waitFor(() => {
      expect(screen.queryByTestId('github-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('qiita-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('x-icon')).toBeInTheDocument();
    });
  });
});
