import { render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router';
import { Register } from '../components/Register';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

/**
 * 登録機能のテスト用モック
 *
 * - ユーザー存在確認: 不正なID重複を防ぐ機能
 * - ユーザー登録: データ保存機能
 * - スキル情報取得: スキル選択用のデータ
 * - ナビゲーション: 登録後の画面遷移機能
 */
// API関連モック
const mockCheckUserExists = jest.fn().mockResolvedValue(false);
const mockInsertUser = jest.fn().mockResolvedValue(true);
const mockAllSkills = jest.fn().mockResolvedValue([
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'React' },
  { id: 3, name: 'TypeScript' },
]);

// APIモジュールのモック化
jest.mock('../lib/user', () => ({
  checkUserExists: () => mockCheckUserExists(),
  insertUser: () => mockInsertUser(),
}));

jest.mock('../lib/skill', () => ({
  AllSkills: () => mockAllSkills(),
}));

// ナビゲーション関連モック
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('Register Component', () => {
  // 各テスト実行前の共通セットアップ
  beforeEach(() => {
    // モックをクリア
    mockCheckUserExists.mockClear();
    mockInsertUser.mockClear();
    mockAllSkills.mockClear();
    mockNavigate.mockClear();

    // コンポーネントをレンダリング
    render(
      <MemoryRouter initialEntries={['/cards/register']}>
        <ChakraProvider>
          <Register />
        </ChakraProvider>
      </MemoryRouter>
    );
  });

  // 基本表示テスト
  it('タイトルが表示されていること', async () => {
    const registerTitle = await screen.findByTestId('title');
    expect(registerTitle).toHaveTextContent('新規登録');
  });

  // 正常系テスト：全項目入力
  it('全項目入力して登録ボタンを押すとトップページに遷移すること', async () => {
    const user = userEvent.setup();

    // 必須項目の入力
    const wordInput = await screen.findByTestId('user-id-input');
    await user.type(wordInput, 'testuser');

    const nameInput = await screen.findByTestId('name-input');
    await user.type(nameInput, 'テストユーザー');

    const descriptionInput = await screen.findByTestId('description-input');
    await user.type(descriptionInput, 'これはテスト用の自己紹介です');

    // スキル選択
    const javascriptText = await screen.findByText('JavaScript');
    await user.click(javascriptText);

    // SNSのID入力
    const githubInput = await screen.findByPlaceholderText('GitHubのIDを入力');
    await user.type(githubInput, 'testuser');

    const qiitaInput = await screen.findByPlaceholderText('QiitaのIDを入力');
    await user.type(qiitaInput, 'testuser');

    const xInput = await screen.findByPlaceholderText('XのIDを入力');
    await user.type(xInput, 'testuser');

    // 登録実行
    const registerButton = await screen.findByTestId('register-button');
    await user.click(registerButton);

    // API呼び出しの検証
    await waitFor(() => {
      expect(mockCheckUserExists).toHaveBeenCalled();
      expect(mockInsertUser).toHaveBeenCalled();
    });

    // 画面遷移の検証
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  // 異常系テスト：IDなし
  it('IDが未入力状態で登録された場合に、エラーメッセージが表示されること', async () => {
    const user = userEvent.setup();

    // ID以外を入力
    const nameInput = await screen.findByTestId('name-input');
    await user.type(nameInput, 'テストユーザー');

    const descriptionInput = await screen.findByTestId('description-input');
    await user.type(descriptionInput, 'これはテスト用の自己紹介です');

    const javascriptText = await screen.findByText('JavaScript');
    await user.click(javascriptText);

    // 登録実行
    const registerButton = await screen.findByTestId('register-button');
    await user.click(registerButton);

    // エラーメッセージ表示の検証
    await waitFor(() => {
      const errorMessage = screen.getByText(/好きな英単語/);
      expect(errorMessage).toBeInTheDocument();
    });

    // 登録APIが呼ばれないことの検証
    expect(mockInsertUser).not.toHaveBeenCalled();
  });

  // 異常系テスト：名前なし
  it('名前が未入力状態で登録された場合に、エラーメッセージが表示されること', async () => {
    const user = userEvent.setup();

    // 名前以外を入力
    const wordInput = await screen.findByTestId('user-id-input');
    await user.type(wordInput, 'testuser');

    const descriptionInput = await screen.findByTestId('description-input');
    await user.type(descriptionInput, 'これはテスト用の自己紹介です');

    const javascriptText = await screen.findByText('JavaScript');
    await user.click(javascriptText);

    // 登録実行
    const registerButton = await screen.findByTestId('register-button');
    await user.click(registerButton);

    // エラーメッセージ表示の検証
    await waitFor(() => {
      const errorMessage = screen.getByText(/名前は必須です/);
      expect(errorMessage).toBeInTheDocument();
    });

    // 登録APIが呼ばれないことの検証
    expect(mockInsertUser).not.toHaveBeenCalled();
  });

  // 異常系テスト：自己紹介なし
  it('自己紹介が未入力状態で登録された場合に、エラーメッセージが表示されること', async () => {
    const user = userEvent.setup();

    // 自己紹介以外を入力
    const wordInput = await screen.findByTestId('user-id-input');
    await user.type(wordInput, 'testuser');

    const nameInput = await screen.findByTestId('name-input');
    await user.type(nameInput, 'テストユーザー');

    const javascriptText = await screen.findByText('JavaScript');
    await user.click(javascriptText);

    // 登録実行
    const registerButton = await screen.findByTestId('register-button');
    await user.click(registerButton);

    // エラーメッセージ表示の検証
    await waitFor(() => {
      const errorMessage = screen.getByText(/自己紹介は必須です/);
      expect(errorMessage).toBeInTheDocument();
    });

    // 登録APIが呼ばれないことの検証
    expect(mockInsertUser).not.toHaveBeenCalled();
  });

  // 正常系テスト：必須項目のみ
  it('必須項目のみ入力して登録ボタンを押すとトップページに遷移すること', async () => {
    const user = userEvent.setup();

    // 必須項目だけを入力
    const wordInput = await screen.findByTestId('user-id-input');
    await user.type(wordInput, 'testuser');

    const nameInput = await screen.findByTestId('name-input');
    await user.type(nameInput, 'テストユーザー');

    const descriptionInput = await screen.findByTestId('description-input');
    await user.type(descriptionInput, 'これはテスト用の自己紹介です');

    const javascriptText = await screen.findByText('JavaScript');
    await user.click(javascriptText);

    // 登録実行
    const registerButton = await screen.findByTestId('register-button');
    await user.click(registerButton);

    // API呼び出しの検証
    await waitFor(() => {
      expect(mockCheckUserExists).toHaveBeenCalled();
      expect(mockInsertUser).toHaveBeenCalled();
    });

    // 画面遷移の検証
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
