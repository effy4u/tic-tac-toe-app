import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [winner, setWinner] = useState(null);

  // Load scores from localStorage on component mount
  useEffect(() => {
    const savedScores = localStorage.getItem('ticTacToeScores');
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  // Save scores to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
  }, [scores]);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setScores(prev => ({
        ...prev,
        [newWinner]: prev[newWinner] + 1
      }));
    } else if (newBoard.every(square => square !== null)) {
      setWinner('draw');
      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1
      }));
    } else {
      setIsXNext(!isXNext);
    }
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    localStorage.removeItem('ticTacToeScores');
  };

  const renderSquare = (index) => {
    const value = board[index];

    return (
      <button
        aria-label={`Square ${index + 1}${value ? `: ${value}` : ''}`}
        className={`flex aspect-square w-full items-center justify-center rounded-2xl border border-[#d9d3c4] bg-[#fffdf8] font-display text-5xl shadow-[0_3px_0_#e8e1d3] transition duration-150 hover:-translate-y-0.5 hover:border-[#9ca98c] hover:bg-[#f5f2e9] hover:shadow-[0_5px_0_#e8e1d3] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d99a52]/40 disabled:cursor-default disabled:hover:translate-y-0 disabled:hover:border-[#d9d3c4] disabled:hover:bg-[#fffdf8] disabled:hover:shadow-[0_3px_0_#e8e1d3] sm:rounded-3xl sm:text-6xl ${
          value === 'X' ? 'text-[#c96d4d]' : 'text-[#46745e]'
        }`}
        onClick={() => handleClick(index)}
        disabled={!!winner || !!value}
      >
        {value}
      </button>
    );
  };

  const getStatusMessage = () => {
    if (winner === 'draw') {
      return "It's a draw!";
    }
    if (winner) {
      return `Winner: ${winner}`;
    }
    return `Next player: ${isXNext ? 'X' : 'O'}`;
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#f2eee3] text-[#263d33]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_16%_12%,rgba(226,177,95,0.28),transparent_35%),radial-gradient(ellipse_at_88%_88%,rgba(95,130,99,0.16),transparent_34%)]"
      />
      <div aria-hidden="true" className="paper-grain pointer-events-none absolute inset-0 -z-10" />

      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-5 py-10 sm:px-8">
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center lg:gap-16">
          <header className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#9b7041]">
              A little friendly competition
            </p>
            <h1 className="font-display text-5xl leading-[0.98] tracking-[-0.055em] text-[#263d33] sm:text-7xl">
              Three in a row.
              <span className="mt-2 block italic text-[#bd704e]">Stay a while.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-sm text-base leading-7 text-[#697368] lg:mx-0">
              The classic game, best played with good company and absolutely no
              rematches. (Okay, one rematch.)
            </p>
            <div className="mt-8 hidden items-center gap-3 text-sm text-[#697368] lg:flex">
              <span className="h-px w-10 bg-[#c4bca9]" />
              <span>Two players · one board · endless glory</span>
            </div>
          </header>

          <section
            aria-label="Tic Tac Toe game"
            className="mx-auto w-full max-w-[430px] rounded-[2rem] border border-white/80 bg-[#fbf9f2]/90 p-5 shadow-[0_24px_70px_rgba(74,65,46,0.14)] backdrop-blur-sm sm:p-8"
          >
            <div className="mb-6 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9b7041]">
                  The match
                </p>
                <h2 className="mt-1 font-display text-2xl text-[#263d33]">
                  Scoreboard
                </h2>
              </div>
              <span className="rounded-full bg-[#e9ede3] px-3 py-1.5 text-xs font-semibold text-[#54715c]">
                First to brag
              </span>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: 'Player X', score: scores.X, mark: 'X', color: 'text-[#c96d4d]' },
                { label: 'Player O', score: scores.O, mark: 'O', color: 'text-[#46745e]' },
                { label: 'Draws', score: scores.draws, mark: '—', color: 'text-[#9b7041]' },
              ].map(({ label, score, mark, color }) => (
                <div
                  className="rounded-2xl border border-[#e7e1d5] bg-white/70 px-2 py-3 text-center sm:px-3"
                  key={label}
                >
                  <span className={`font-display text-xl ${color}`}>{mark}</span>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#817e72] sm:text-[11px]">
                    {label}
                  </p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-[#263d33]">
                    {score}
                  </p>
                </div>
              ))}
            </div>

            <div
              aria-live="polite"
              className="mb-5 flex min-h-12 items-center justify-center rounded-xl bg-[#eee9dd] px-4 py-3 text-sm font-semibold text-[#435a4b]"
            >
              {getStatusMessage()}
            </div>

            <div className="grid grid-cols-3 gap-2.5 rounded-[1.65rem] bg-[#e8e3d7] p-2.5 sm:gap-3 sm:p-3">
              {board.map((_, index) => (
                <React.Fragment key={index}>{renderSquare(index)}</React.Fragment>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
              <button
                className="rounded-xl bg-[#355e4b] px-5 py-3 text-sm font-bold text-white shadow-[0_3px_0_#254432] transition hover:-translate-y-0.5 hover:bg-[#2d523f] hover:shadow-[0_5px_0_#254432] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#63866b]/35 active:translate-y-0 active:shadow-[0_2px_0_#254432]"
                onClick={resetGame}
              >
                New game
              </button>
              <button
                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#8c7460] transition hover:bg-[#eee9dd] hover:text-[#5c4d3e] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d99a52]/30"
                onClick={resetScores}
              >
                Reset scores
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
