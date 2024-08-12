import React, { useState } from "react";
import Confetti from "./confetti/Confetti"; // Import the Confetti component
import "./style.css";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onSquareClick }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    onSquareClick(i);
  }

  const winner = calculateWinner(squares);
  const isDraw = squares.every((square) => square !== null) && !winner;
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isDraw) {
    status = "It's a Draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-pos">
        <div className="board-row">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </div>
      {winner && <Confetti />} {/* Render Confetti if there is a winner */}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const winner = calculateWinner(currentSquares);
  const isDraw = currentSquares.every((square) => square !== null) && !winner;

  function handlePlay(i) {
    const nextSquares = currentSquares.slice();
    if (nextSquares[i] || winner) {
      return;
    }

    nextSquares[i] = xIsNext ? "X" : "O";
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    // Update undo and redo stacks
    setUndoStack([...undoStack, currentMove]);
    setRedoStack([]);
  }

  function handleUndo() {
    if (undoStack.length === 0) {
      return;
    }

    const prevMove = undoStack.pop();
    setUndoStack([...undoStack]);
    setRedoStack([currentMove, ...redoStack]);
    setCurrentMove(prevMove);
  }

  function handleRedo() {
    if (redoStack.length === 0) {
      return;
    }

    const nextMove = redoStack.shift();
    setRedoStack([...redoStack]);
    setUndoStack([...undoStack, currentMove]);
    setCurrentMove(nextMove);
  }

  function handleReset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setUndoStack([]);
    setRedoStack([]);
  }

  return (
    <>
      <div id="gamename">TIC TAC TOE</div>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onSquareClick={handlePlay} />
        </div>
        <div className="game-info">
          <button onClick={handleUndo} disabled={undoStack.length === 0}>
            Undo
          </button>
          <button onClick={handleRedo} disabled={redoStack.length === 0}>
            Redo
          </button>
          <button onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
