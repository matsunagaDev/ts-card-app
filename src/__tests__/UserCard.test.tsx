import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router';
import { UserCard } from '../components/UserCard';
import userEvent from '@testing-library/user-event';

/**
 * ユーザーカード表示時の操作テスト
 *
 * - データ取得: ユーザー情報の取得機能をモック
 * - 画面遷移: ホーム画面への戻る機能をモック
 */
// API関連モック
const mockUser = jest.fn();
jest.mock('../lib/userSkill', () => ({
  getUserSkillById: () => mockUser,
}));

// 画面遷移モック
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('UserCard Component', () => {
  // 各テスト実行前のモッククリア
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUser.mockClear();
  });

  it('戻るボタンをクリックするとホーム画面に遷移する', async () => {
    const user = userEvent.setup();

    // テスト用データの設定
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

    // モックの戻り値設定
    mockUser.mockResolvedValue(mockUserData);

    // 特定のルートでコンポーネントをレンダリング
    render(
      <MemoryRouter initialEntries={['/cards/testuser']}>
        <ChakraProvider>
          <UserCard />
        </ChakraProvider>
      </MemoryRouter>
    );

    // 戻るボタンを探して存在確認
    const backButton = await screen.findByTestId('back-button');
    expect(backButton).toBeInTheDocument();

    // 戻るボタンをクリック
    await user.click(backButton);

    // ナビゲーション関数が正しく呼ばれたことを確認
    await expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
