import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router';
import { UserCard } from '../components/UserCard';
import { getUserSkillById } from '../lib/userSkill';

/**
 * モックの作成
 */
// Supabaseクライアントのシンプルなモック
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
  beforeEach(() => {
    // モックのリセット
    jest.clearAllMocks();
  });

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

    // コンポーネントをレンダリング - BrowserRouterでWrappingしてAppをレンダリング
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    // idを入力するテキストボックスを取得
    const userInput = await waitFor(
      () => {
        const input = screen.queryByTestId('id-input');
        if (!input) throw new Error('Input not found');
        return input;
      },
      { timeout: 2000 }
    );

    // 「名刺を見る」ボタンを取得
    const viewButton = await waitFor(
      () => {
        const button =
          screen.queryByTestId('view-button') ||
          screen.getByRole('button', { name: /名刺を見る/i });
        if (!button) throw new Error('Button not found');
        return button;
      },
      { timeout: 2000 }
    );

    // idを入力
    await user.type(userInput, 'testuser');

    // テストのデバッグ用にDOMを出力
    console.log('クリック前のDOM:', document.body.innerHTML);

    // ボタンをクリック
    await user.click(viewButton);

    // 非同期処理が完了するのを待つ
    await waitFor(
      () => {
        const userName = screen.queryByTestId('user-name');
        if (!userName) throw new Error('User name element not found');
        expect(userName).toHaveTextContent('テストユーザー');
      },
      { timeout: 3000 }
    );

    // 自己紹介が表示されていることを確認
    await waitFor(() => {
      expect(screen.queryByTestId('user-description')).toBeInTheDocument();
    });

    // スキルリストが表示されていることを確認
    await waitFor(() => {
      const skillList = screen.queryByTestId('skill-list');
      expect(skillList).toBeInTheDocument();
    });

    // 各スキルが表示されていることを確認
    await waitFor(() => {
      expect(screen.queryByText('JavaScript')).toBeInTheDocument();
      expect(screen.queryByText('React')).toBeInTheDocument();
    });

    // GitHubリンクが表示されていることを確認
    await waitFor(() => {
      const githubLink = screen.queryByTestId('github-link');
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com/testuser');
    });
  });

  it('handles error when fetching user data', async () => {
    // モック関数がエラーを投げるように設定
    (getUserSkillById as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch user')
    );

    // コンポーネントをレンダリング
    render(
      <ChakraProvider>
        <BrowserRouter>
          <UserCard />
        </BrowserRouter>
      </ChakraProvider>
    );

    // エラー処理が行われることを確認する方法は、
    // コンポーネント側でエラー時の表示要素があれば、それをチェックします
    await waitFor(() => {
      // エラーメッセージが表示される場合、それをチェック
      // または、ユーザーデータが表示されないことを確認
      expect(screen.queryByTestId('user-name')).not.toHaveTextContent(
        'テストユーザー'
      );
    });
  });
});
