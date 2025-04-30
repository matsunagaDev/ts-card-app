import { getUserSkillById } from '../lib/userSkill';
import { UserCard } from '../components/UserCard';
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

/**
 * モックの作成
 */
// Supabaseクライアントのモック
const mockUser = jest.fn();
jest.mock('../lib/userSkill', () => ({
  getUserSkillById: () => mockUser,
}));
// useNavigateのモックを設定
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('UserCard back to home', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUser.mockClear();
  });

  it('ホーム画面に遷移する', async () => {
    // ユーザーイベントのセットアップ
    const user = userEvent.setup();

    // モックユーザーデータ
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

    // モックの設定
    mockUser.mockResolvedValue(mockUserData);

    render(
      <MemoryRouter initialEntries={['/cards/testuser']}>
        <ChakraProvider>
          <UserCard />
        </ChakraProvider>
      </MemoryRouter>
    );

    // 戻るボタンが表示されるまで待機
    const backButton = await screen.findByTestId('back-button');
    expect(backButton).toBeInTheDocument();

    // ボタンをクリック（await を追加）
    await user.click(backButton);

    // ナビゲーションが呼ばれるまで待機
    await expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
