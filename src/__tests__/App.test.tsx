import { render, screen } from '@testing-library/react';
import { App } from '../App';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';

describe('App Component', () => {
  it('renders title correctly', () => {
    // ChakraProviderでラップしてレンダリング
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    // タイトルの要素を取得
    const titleElement = screen.getByTestId('title');

    // アサーション
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('オンライン名刺アプリ');
  });
});
