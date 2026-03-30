import { useContext, useMemo, useState } from 'react';
import Draggable from 'react-draggable';
import UseContext from '../Context';
import ticTacToeLogo from '../assets/tictactoelogo.png';
import '../css/RetroGames.css';

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function TicTacToe() {
  const {
    themeDragBar,
    TicTacToeExpand,
    setTicTacToeExpand,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
  } = useContext(UseContext);

  const [board, setBoard] = useState(Array(9).fill(''));
  const [isBotTurn, setIsBotTurn] = useState(false);

  const winner = useMemo(() => {
    for (const [a, b, c] of winningLines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }, [board]);

  const isDraw = !winner && board.every(Boolean);

  function handleDragStop(event, data) {
    setTicTacToeExpand(prev => ({ ...prev, x: data.x, y: data.y }));
  }

  function toggleExpand() {
    setTicTacToeExpand(prev => ({ ...prev, expand: !prev.expand }));
  }

  function resetGame() {
    setBoard(Array(9).fill(''));
    setIsBotTurn(false);
  }

  function makeBotMove(nextBoard) {
    const freeCells = nextBoard
      .map((value, index) => (value ? null : index))
      .filter(index => index !== null);

    if (freeCells.length === 0) {
      setIsBotTurn(false);
      return;
    }

    const choice = freeCells[Math.floor(Math.random() * freeCells.length)];
    const updatedBoard = [...nextBoard];
    updatedBoard[choice] = 'O';
    setBoard(updatedBoard);
    setIsBotTurn(false);
  }

  function handleMove(index) {
    if (board[index] || winner || isDraw || isBotTurn) return;

    const nextBoard = [...board];
    nextBoard[index] = 'X';
    setBoard(nextBoard);

    const hasWinner = winningLines.some(
      ([a, b, c]) => nextBoard[a] && nextBoard[a] === nextBoard[b] && nextBoard[a] === nextBoard[c]
    );
    const filled = nextBoard.every(Boolean);

    if (hasWinner || filled) return;

    setIsBotTurn(true);
    setTimeout(() => makeBotMove(nextBoard), 320);
  }

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
      ? 'Draw game'
      : isBotTurn
        ? 'Computer is thinking...'
        : 'Your turn as X';

  return (
    <Draggable
      axis="both"
      handle=".retro-game-dragbar"
      grid={[1, 1]}
      scale={1}
      disabled={TicTacToeExpand.expand}
      bounds={{ top: 0 }}
      defaultPosition={{
        x: window.innerWidth <= 500 ? 8 : 240,
        y: window.innerWidth <= 500 ? 120 : 140,
      }}
      onStop={handleDragStop}
      onStart={() => handleSetFocusItemTrue('TicTacToe')}
    >
      <div
        className="retro-game-window"
        onClick={e => {
          e.stopPropagation();
          handleSetFocusItemTrue('TicTacToe');
        }}
        style={TicTacToeExpand.expand ? inlineStyleExpand('TicTacToe') : inlineStyle('TicTacToe')}
      >
        <div
          className="retro-game-dragbar"
          onDoubleClick={toggleExpand}
          style={{ background: TicTacToeExpand.focusItem ? themeDragBar : '#757579' }}
        >
          <div className="retro-game-title folder_barname-project">
            <img src={ticTacToeLogo} alt="TicTacToe" />
            <span>Tic Tac Toe</span>
          </div>
          <div className="retro-game-buttons folder_barbtn-project">
            <div
              onClick={!isTouchDevice ? e => {
                e.stopPropagation();
                setTicTacToeExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('TicTacToe');
              } : undefined}
              onTouchEnd={e => {
                e.stopPropagation();
                setTicTacToeExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('TicTacToe');
              }}
              onTouchStart={e => e.stopPropagation()}
            >
              <p className="dash-project"></p>
            </div>
            <div
              onClick={!isTouchDevice ? e => {
                e.stopPropagation();
                toggleExpand();
              } : undefined}
              onTouchEnd={e => {
                e.stopPropagation();
                toggleExpand();
              }}
              onTouchStart={e => e.stopPropagation()}
            >
              <div className={`expand-project ${TicTacToeExpand.expand ? 'full' : ''}`}></div>
              {TicTacToeExpand.expand ? <div className="expand_2-project"></div> : null}
            </div>
            <div>
              <p
                className="x-project"
                onClick={!isTouchDevice ? e => {
                  e.stopPropagation();
                  deleteTap('TicTacToe');
                } : undefined}
                onTouchEnd={e => {
                  e.stopPropagation();
                  deleteTap('TicTacToe');
                }}
              >
                ×
              </p>
            </div>
          </div>
        </div>

        <div className="retro-game-menu">
          <p>Game</p>
          <p>Help</p>
        </div>

        <div className="retro-game-body">
          <div className="retro-game-panel">
            <div className="retro-game-toolbar">
              <button onClick={resetGame}>New Game</button>
              <div className="retro-game-stats">
                <span>Player: X</span>
                <span>Computer: O</span>
              </div>
            </div>
            <p className="retro-game-status">{status}</p>
            <div className="tictactoe-board">
              {board.map((cell, index) => (
                <button key={index} onClick={() => handleMove(index)}>
                  {cell}
                </button>
              ))}
            </div>
            <p className="tictactoe-footer">Beat the computer or force a draw.</p>
          </div>
        </div>
      </div>
    </Draggable>
  );
}

export default TicTacToe;
