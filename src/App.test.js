import { render, screen } from '@testing-library/react';
import App from './App';

test('renders a new tic tac toe game', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /three in a row/i })).toBeInTheDocument();
  expect(screen.getByText(/next player: x/i)).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /^Square \d/ })).toHaveLength(9);
});
