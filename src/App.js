import React, { useState } from "react";

const emptyBoard = Array(9).fill(null);

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkWinner = (board) => {
  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes(null) ? null : "Draw";
};

const minMax = (board, isMaximizing, level, depth = 0) => {
  const winner = checkWinner(board);
  if (winner === "O") return { score: 10 - depth };
  if (winner === "X") return { score: depth - 10 };
  if (winner === "Draw") return { score: 0 };

  const moves = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      const newBoard = [...board];
      newBoard[i] = isMaximizing ? "O" : "X";
      const result = minMax(newBoard, !isMaximizing, level, depth + 1);
      moves.push({ index: i, score: result.score });
    }
  }

  if (level === "easy") {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  let bestMove = null;
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let move of moves) {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let move of moves) {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    }
  }
  return bestMove;
};

const Square = ({ value, onClick }) => (
  <button
    className="w-24 h-24 text-5xl font-extrabold flex items-center justify-center border border-purple-500 bg-gradient-to-br from-purple-900 to-indigo-900 shadow-inner text-cyan-300 hover:brightness-125 transition-all duration-200"
    onClick={onClick}
  >
    {value}
  </button>
);

const App = () => {
  const [board, setBoard] = useState(emptyBoard);
  const [isXTurn, setIsXTurn] = useState(true);
  const [mode, setMode] = useState("AI");
  const [level, setLevel] = useState("hard");
  const winner = checkWinner(board);

  const handleClick = (i) => {
    if (board[i] || winner) return;

    const newBoard = [...board];
    newBoard[i] = isXTurn ? "X" : "O";
    setBoard(newBoard);
    setIsXTurn(!isXTurn);

    if (mode === "AI" && isXTurn) {
      setTimeout(() => {
        const aiMove = minMax(newBoard, true, level);
        if (aiMove && newBoard[aiMove.index] === null) {
          newBoard[aiMove.index] = "O";
          setBoard([...newBoard]);
          setIsXTurn(true);
        }
      }, 500);
    }
  };

  const resetGame = () => {
    setBoard(emptyBoard);
    setIsXTurn(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white font-sans">
      <nav className="w-full bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-4 px-8 flex justify-between items-center shadow-md">
        <h1 className="text-3xl font-extrabold tracking-wide">Cosmic Tic Tac Toe</h1>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-white rounded-md bg-purple-500 hover:bg-purple-600 font-medium">Game</button>
          <a className="px-4 py-2 rounded-md hover:bg-purple-700 transition" href="#about">About</a>
        </div>
      </nav>

      <div className="mt-10 bg-gradient-to-br from-purple-800 to-indigo-900 p-6 rounded-xl shadow-xl text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Select Game Mode</h2>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setMode("AI")}
            className={`px-6 py-2 rounded-full font-semibold transition ${mode === "AI" ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Play vs AI
          </button>
          <button
            onClick={() => setMode("2P")}
            className={`px-6 py-2 rounded-full font-semibold transition ${mode === "2P" ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Two Players
          </button>
        </div>
        {mode === "AI" && (
          <select
            className="mt-4 bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-full"
            onChange={(e) => setLevel(e.target.value)}
            value={level}
          >
            <option value="easy">Easy</option>
            <option value="hard">Hard</option>
          </select>
        )}
      </div>

      <div className="mt-8 text-2xl font-bold">
        {winner ? (
          winner === "Draw" ? "It's a Draw" : `${winner} Wins!`
        ) : (
          <span>
            Next player: {isXTurn ? <span className="text-cyan-400">X 🔵</span> : <span className="text-pink-400">O 🔴</span>}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        {board.map((value, i) => (
          <Square key={i} value={value} onClick={() => handleClick(i)} />
        ))}
      </div>

      <button
        className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 hover:brightness-110 rounded-full font-semibold shadow-md"
        onClick={resetGame}
      >
        Restart
      </button>

      <div id="about" className="mt-16 max-w-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg text-gray-300">
        <h2 className="text-3xl font-bold mb-4 text-white">About Min-Max</h2>
        <p>
          Min-Max is a recursive algorithm used in decision making and game theory.
          It is used to find the optimal move for a player, assuming that the opponent
          also plays optimally. It explores all possible moves and chooses the one that
          maximizes the player's chances of winning while minimizing the opponent's.
        </p>
      </div>
    </div>
  );
};

export default App;