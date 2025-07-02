import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders Tic Tac Toe header", () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
});

test("clicking squares places X and O alternately", () => {
  render(<App />);
  const squares = screen.getAllByRole("button", { name: /empty cell/i });
  fireEvent.click(squares[0]);
  expect(squares[0]).toHaveTextContent("X");
  fireEvent.click(squares[1]);
  expect(squares[1]).toHaveTextContent("O");
});

test("detects winner and disables input after win", () => {
  render(<App />);
  const squares = screen.getAllByRole("button", { name: /empty cell/i });
  // X moves: 0, 1, 2 (horizontal win)
  fireEvent.click(squares[0]); // X
  fireEvent.click(squares[3]); // O
  fireEvent.click(squares[1]); // X
  fireEvent.click(squares[4]); // O
  fireEvent.click(squares[2]); // X
  expect(screen.getByText(/Winner: X/i)).toBeInTheDocument();
  // Try clicking a remaining square after win
  fireEvent.click(squares[5]);
  expect(squares[5]).toHaveTextContent("");
});

test("restart button resets the board and history", () => {
  render(<App />);
  const squares = screen.getAllByRole("button", { name: /empty cell/i });
  fireEvent.click(squares[0]);
  fireEvent.click(squares[1]);
  fireEvent.click(squares[2]);
  fireEvent.click(screen.getByText(/Restart Game/i));
  // Board is reset
  screen.getAllByRole("button", { name: /empty cell/i }).forEach(btn => {
    expect(btn).toHaveTextContent("");
  });
  expect(screen.getByText(/Game start/i)).toBeInTheDocument();
});
