import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router';
import { Home } from '../components/Home';

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

// スキルデータ取得用API
jest.mock('../lib/skill', () => ({
  AllSkills: jest.fn().mockResolvedValue([
    { id: 1, name: 'React' },
    { id: 2, name: 'TypeScript' },
    { id: 3, name: 'GitHub' },
  ]),
}));

// ナビゲーションのモック
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

// アプリ全体の基本機能テスト
describe('App Component', () => {
  beforeEach(() => {
    // テスト前にモックをリセット
    mockNavigate.mockClear();

    // コンポーネントをレンダリング
    render(
      <MemoryRouter initialEntries={['/']}>
        <ChakraProvider>
          <Home />
        </ChakraProvider>
      </MemoryRouter>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('タイトルが正しく表示される', () => {
    const titleElement = screen.getByTestId('title');
    expect(titleElement).toHaveTextContent('名刺アプリ');
  });

  it('IDを入力して名刺を見るボタンを押すと、cards/:idに遷移すること', async () => {
    // テストユーザー操作の準備
    const user = userEvent.setup();

    // ホーム画面でIDを入力
    const idInput = await screen.findByTestId('id-input');
    await user.type(idInput, 'testuser');

    // 「名刺を見る」ボタンをクリック
    const viewButton = await screen.findByTestId('view-button');
    await user.click(viewButton);

    // 正しい画面遷移が行われたことを確認
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/cards/testuser');
    });
  });

  it('IDを入力せずに名刺を見るボタンを押すと、エラーメッセージが表示されること', async () => {
    // テストユーザー操作の準備
    const user = userEvent.setup();

    // ホーム画面でIDを入力せずに「名刺を見る」ボタンをクリック
    const viewButton = await screen.findByTestId('view-button');
    await user.click(viewButton);

    // エラーメッセージが表示されることを確認
    const errorMessage = await screen.findByText('IDを入力してください');
    expect(errorMessage).toBeInTheDocument();
  });

  it('新規登録ボタンを押下すると/cards/registerに遷移すること', async () => {
    // テストユーザー操作の準備
    const user = userEvent.setup();

    // ホーム画面で「新規登録」ボタンをクリック
    const registerLink = await screen.findByTestId('register-link');
    await user.click(registerLink);

    // 正しい画面遷移が行われたことを確認
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/cards/register');
    });
  });
});
