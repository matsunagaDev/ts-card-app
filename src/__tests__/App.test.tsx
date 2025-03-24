import { render, screen } from '@testing-library/react';
import { App } from '../App';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';

describe('App Component', () => {
  // テスト後にクリーンアップを実行
  afterAll(async () => {
    const { supabase } = await import('../utils/supabase');
    await supabase.auth.signOut();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 接続が完全に閉じるのを待つ
  });

  it('renders title correctly', () => {
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
