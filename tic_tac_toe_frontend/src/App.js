import React, { useState, useEffect } from "react";
import "./App.css";

// Color variables for the theme
const COLORS = {
  primary: "#1976d2",
  accent: "#ff9800",
  secondary: "#424242",
  lightBg: "#fff"
};

/**
 * Returns the winner ("X" or "O"), or null if no winner yet.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diags
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  /**
   * The game state: array of { squares: string[9], move: string }
   *   - squares: the board at this moment
   *   - move: the description of this move
   */
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), move: "Game start" }
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXisNext] = useState(true);
  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);
  const isBoardFull = current.squares.every(Boolean);
  const status = winner
    ? `Winner: ${winner}`
    : isBoardFull
      ? "Draw!"
      : `Next: ${xIsNext ? "X" : "O"}`;

  // PUBLIC_INTERFACE
  function handleClick(i) {
    const past = history.slice(0, stepNumber + 1);
    const currentBoard = past[past.length - 1];
    const squares = currentBoard.squares.slice();
    if (winner || squares[i]) return;
    squares[i] = xIsNext ? "X" : "O";
    setHistory(
      past.concat([
        {
          squares: squares,
          move: `Player ${xIsNext ? "X" : "O"} to (${Math.floor(i / 3) + 1}, ${(i % 3) + 1})`
        }
      ])
    );
    setStepNumber(past.length);
    setXisNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function jumpTo(stepIdx) {
    setStepNumber(stepIdx);
    setXisNext(stepIdx % 2 === 0);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setHistory([
      { squares: Array(9).fill(null), move: "Game start" }
    ]);
    setStepNumber(0);
    setXisNext(true);
  }

  return (
    <div
      className="ttt-root"
      style={{
        minHeight: "100vh",
        background: COLORS.lightBg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif"
      }}
    >
      <div
        className="ttt-container"
        style={{
          background: "#fff",
          boxShadow: "0 4px 18px 0 #bccbe1bb",
          borderRadius: "18px",
          padding: "32px 28px 24px 28px",
          minWidth: 340,
          maxWidth: "94vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <h1 className="ttt-title" style={{
          color: COLORS.primary,
          marginBottom: "3px",
          fontSize: 30,
          letterSpacing: 1.5,
          fontWeight: 700
        }}>
          Tic Tac Toe
        </h1>
        <div
          className="ttt-status"
          style={{
            color: winner ? COLORS.accent : COLORS.secondary,
            fontSize: 20,
            minHeight: 30,
            fontWeight: 500,
            marginBottom: "14px"
          }}
          aria-live="polite"
        >
          {status}
        </div>

        <Board
          squares={current.squares}
          onClick={handleClick}
          hasWinner={!!winner}
        />

        <button
          className="ttt-restart"
          style={{
            marginTop: 24,
            background: COLORS.primary,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "9px 36px",
            fontWeight: 600,
            fontSize: 17,
            cursor: "pointer",
            boxShadow: "0 2px 10px 0 #1976d23e",
            letterSpacing: 0.4,
            outline: "none",
            transition: "background 0.13s"
          }}
          onClick={handleRestart}
          tabIndex={0}
        >
          Restart Game
        </button>

        <HistoryPanel
          history={history}
          stepNumber={stepNumber}
          jumpTo={jumpTo}
        />
      </div>
      <footer style={{
        marginTop: 22,
        fontSize: 13,
        color: "#999999"
      }}>
        <span>
          {`Made with `}
          <span role="img" aria-label="tic tac toe">❌⭕</span>
        </span>
      </footer>
    </div>
  );
}

/**
 * Game Board - Renders the 3x3 grid
 */
function Board({ squares, onClick, hasWinner }) {
  return (
    <div
      className="ttt-board"
      aria-label="Game board"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 70px)",
        gridTemplateRows: "repeat(3, 70px)",
        gap: "5px",
        justifyContent: "center",
        margin: "12px 0"
      }}
    >
      {squares.map((v, i) => (
        <Square
          key={i}
          value={v}
          onClick={() => onClick(i)}
          disabled={Boolean(v) || hasWinner}
        />
      ))}
    </div>
  );
}

/**
 * Board Square
 */
function Square({ value, onClick, disabled }) {
  return (
    <button
      className="ttt-square"
      style={{
        width: 70,
        height: 70,
        background: "#fff",
        border: `2px solid ${COLORS.primary}`,
        borderRadius: 9,
        fontSize: 36,
        color:
          value === "X"
            ? COLORS.primary
            : value === "O"
              ? COLORS.accent
              : COLORS.secondary,
        fontWeight: "700",
        cursor: disabled ? "default" : "pointer",
        transition: "background 0.09s"
      }}
      onClick={disabled ? undefined : onClick}
      aria-label={value ? `Cell: ${value}` : "Empty cell"}
      tabIndex={disabled ? -1 : 0}
      disabled={disabled}
    >
      {value}
    </button>
  );
}

/**
 * Move History Panel
 */
function HistoryPanel({ history, stepNumber, jumpTo }) {
  return (
    <div
      className="ttt-history"
      style={{
        marginTop: 25,
        width: "100%",
        background: "#f7f8fa",
        borderRadius: 8,
        padding: "10px 13px 8px 13px",
        minHeight: 58,
        boxSizing: "border-box",
        boxShadow: "0 0.5px 2.5px #eeeeeea0",
        fontSize: 15,
        maxHeight: 132,
        overflowY: "auto"
      }}
    >
      <div style={{
        color: COLORS.secondary,
        fontWeight: 600,
        fontSize: 13,
        marginBottom: 3,
        letterSpacing: 0.7
      }}>Move History</div>
      <ol style={{ margin: 0, paddingLeft: 17 }}>
        {history.map((step, idx) => (
          <li
            key={idx}
            style={{
              marginBottom: 2,
              fontWeight: idx === stepNumber ? 700 : 400,
              color: idx === stepNumber ? COLORS.primary : COLORS.secondary,
              fontSize: idx === stepNumber ? 15.4 : 15,
              listStyle: "decimal"
            }}
          >
            {idx === stepNumber ? (
              step.move
            ) : (
              <button
                onClick={() => jumpTo(idx)}
                style={{
                  background: "none",
                  border: "none",
                  color: COLORS.primary,
                  textDecoration: "underline",
                  cursor: "pointer",
                  font: "inherit",
                  padding: 0,
                  transition: "color 0.12s"
                }}
                aria-label={`Go to move ${idx}: ${step.move}`}
                tabIndex={0}
              >
                {step.move}
              </button>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
