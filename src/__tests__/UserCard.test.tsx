import { App } from '../App';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import '@testing-library/jest-dom';
import { UserCard } from '../components/UserCard';

// API関連モック
const mockGetUserSkillById = jest.fn();
jest.mock('../lib/userSkill', () => ({
  getUserSkillById: () => mockGetUserSkillById(),
}));

// useToastのモック化
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    useToast: jest.fn(() => {
      const toast: any = jest.fn();
      toast.promise = jest.fn();
      return toast;
    }),
  };
});

// 画面遷移モック
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('UserCard', () => {
  beforeEach(async () => {
    // テスト用データの準備
    mockGetUserSkillById.mockResolvedValue({
      user_id: 'testuser',
      name: 'テストユーザー',
      description: '<p>これはテスト用の自己紹介です</p>',
      skills: [
        { id: '1', name: 'React' },
        { id: '2', name: 'TypeScript' },
      ],
      github_id: 'https://github.com/testuser',
      qiita_id: 'https://qiita.com/testuser',
      x_id: 'https://x.com/testuser',
      created_at: '2025-01-01 12:00:00',
    });

    // 状態更新を act でラップ
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/cards/testuser']}>
          <Routes>
            <Route
              path="/cards/:id"
              element={
                <ChakraProvider>
                  <UserCard />
                </ChakraProvider>
              }
            />
          </Routes>
        </MemoryRouter>
      );
    });
  });

  it('ユーザー名が表示されていること', async () => {
    const userName = await screen.findByTestId('user-name');
    expect(userName).toBeInTheDocument();
    expect(userName).toHaveTextContent('テストユーザー');
  });

  it('自己紹介が表示されていること', async () => {
    const description = await screen.findByTestId('user-description');
    expect(description).toBeInTheDocument();
    expect(description.innerHTML).toContain('これはテスト用の自己紹介です');
  });

  it('スキルが表示されていること', async () => {
    const skillItems = await screen.findAllByTestId('skill-item');
    expect(skillItems[0]).toHaveTextContent('React');
    expect(skillItems[1]).toHaveTextContent('TypeScript');
  });

  it('SNSのアイコンが表示されていること', async () => {
    const githubIcon = await screen.findByTestId('github-icon');
    expect(githubIcon).toBeInTheDocument();

    const qiitaIcon = await screen.findByTestId('qiita-icon');
    expect(qiitaIcon).toBeInTheDocument();

    const xIcon = await screen.findByTestId('x-icon');
    expect(xIcon).toBeInTheDocument();
  });

  it('戻るボタンをクリックするとホーム画面に遷移すること', async () => {
    const backButton = await screen.findByTestId('back-button');
    await userEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
