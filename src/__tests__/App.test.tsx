import { render, screen } from '@testing-library/react';
import { App } from '../App';
import '@testing-library/jest-dom';

describe('App Component', () => {
  it('renders title correctly', () => {
    render(<App />);
    const titleElement = screen.getByTestId('title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('オンライン名刺アプリ');
  });
});
