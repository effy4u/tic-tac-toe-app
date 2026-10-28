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
    return (
      <button
        className="square"
        onClick={() => handleClick(index)}
        disabled={!!winner}
      >
        {board[index]}
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
    <div className="app">
      <h1>Tic Tac Toe</h1>
      
      <div className="score-board">
        <div className="score">
          <span>Player X: {scores.X}</span>
        </div>
        <div className="score">
          <span>Player O: {scores.O}</span>
        </div>
        <div className="score">
          <span>Draws: {scores.draws}</span>
        </div>
      </div>

      <div className="status">{getStatusMessage()}</div>

      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>

      <div className="controls">
        <button className="reset-btn" onClick={resetGame}>
          New Game
        </button>
        <button className="reset-btn" onClick={resetScores}>
          Reset Scores
        </button>
      </div>
    </div>
  );
}

export default App;
