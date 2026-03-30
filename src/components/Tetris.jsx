import { useContext, useEffect, useMemo, useState } from 'react';
import Draggable from 'react-draggable';
import UseContext from '../Context';
import tetrisLogo from '../assets/tetrislogo.png';
import '../css/RetroGames.css';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const pieces = [
  { color: '#00d7ff', cells: [[0, 1], [1, 1], [2, 1], [3, 1]] },
  { color: '#ffe600', cells: [[1, 0], [2, 0], [1, 1], [2, 1]] },
  { color: '#9e4dff', cells: [[1, 0], [0, 1], [1, 1], [2, 1]] },
  { color: '#44cc66', cells: [[1, 0], [2, 0], [0, 1], [1, 1]] },
  { color: '#ff5252', cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  { color: '#2d7fff', cells: [[0, 0], [0, 1], [1, 1], [2, 1]] },
  { color: '#ff9a2f', cells: [[2, 0], [0, 1], [1, 1], [2, 1]] },
];

function emptyBoard() {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(''));
}

function randomPiece() {
  const picked = pieces[Math.floor(Math.random() * pieces.length)];
  return {
    color: picked.color,
    cells: picked.cells.map(([x, y]) => [x, y]),
  };
}

function rotatePiece(piece) {
  const rotated = piece.cells.map(([x, y]) => [y, 3 - x]);
  const minX = Math.min(...rotated.map(([x]) => x));
  const minY = Math.min(...rotated.map(([, y]) => y));
  return rotated.map(([x, y]) => [x - minX, y - minY]);
}

function Tetris() {
  const {
    themeDragBar,
    TetrisExpand,
    setTetrisExpand,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
  } = useContext(UseContext);

  const [board, setBoard] = useState(emptyBoard);
  const [piece, setPiece] = useState(randomPiece);
  const [position, setPosition] = useState({ x: 3, y: 0 });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [running, setRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  function handleDragStop(event, data) {
    setTetrisExpand(prev => ({ ...prev, x: data.x, y: data.y }));
  }

  function toggleExpand() {
    setTetrisExpand(prev => ({ ...prev, expand: !prev.expand }));
  }

  function canMove(nextCells, nextPosition, nextBoard = board) {
    return nextCells.every(([cellX, cellY]) => {
      const x = nextPosition.x + cellX;
      const y = nextPosition.y + cellY;
      return (
        x >= 0 &&
        x < BOARD_WIDTH &&
        y >= 0 &&
        y < BOARD_HEIGHT &&
        !nextBoard[y][x]
      );
    });
  }

  function spawnPiece(nextBoard) {
    const upcomingPiece = randomPiece();
    const nextPosition = { x: 3, y: 0 };

    if (!canMove(upcomingPiece.cells, nextPosition, nextBoard)) {
      setGameOver(true);
      setRunning(false);
      return;
    }

    setPiece(upcomingPiece);
    setPosition(nextPosition);
  }

  function lockPiece() {
    const nextBoard = board.map(row => [...row]);

    piece.cells.forEach(([cellX, cellY]) => {
      const x = position.x + cellX;
      const y = position.y + cellY;
      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        nextBoard[y][x] = piece.color;
      }
    });

    const filteredRows = nextBoard.filter(row => row.some(cell => !cell));
    const cleared = BOARD_HEIGHT - filteredRows.length;

    while (filteredRows.length < BOARD_HEIGHT) {
      filteredRows.unshift(Array(BOARD_WIDTH).fill(''));
    }

    setBoard(filteredRows);
    if (cleared > 0) {
      setLines(prev => prev + cleared);
      setScore(prev => prev + cleared * 100);
    }
    spawnPiece(filteredRows);
  }

  function stepDown() {
    if (gameOver) return;

    const nextPosition = { x: position.x, y: position.y + 1 };
    if (canMove(piece.cells, nextPosition)) {
      setPosition(nextPosition);
      return;
    }

    lockPiece();
  }

  function resetGame() {
    const freshPiece = randomPiece();
    setBoard(emptyBoard());
    setPiece(freshPiece);
    setPosition({ x: 3, y: 0 });
    setScore(0);
    setLines(0);
    setGameOver(false);
    setRunning(true);
  }

  useEffect(() => {
    if (!TetrisExpand.show || TetrisExpand.hide || !running || gameOver) return undefined;

    const speed = Math.max(140, 520 - lines * 12);
    const timer = setTimeout(() => {
      stepDown();
    }, speed);

    return () => clearTimeout(timer);
  }, [TetrisExpand.show, TetrisExpand.hide, running, gameOver, piece, position, board, lines]);

  useEffect(() => {
    if (!TetrisExpand.show || TetrisExpand.hide || !TetrisExpand.focusItem) return undefined;

    function handleKeyDown(event) {
      if (gameOver) return;

      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(event.key)) {
        event.preventDefault();
      }

      if (event.key === 'ArrowLeft') {
        const nextPosition = { x: position.x - 1, y: position.y };
        if (canMove(piece.cells, nextPosition)) {
          setPosition(nextPosition);
        }
      }

      if (event.key === 'ArrowRight') {
        const nextPosition = { x: position.x + 1, y: position.y };
        if (canMove(piece.cells, nextPosition)) {
          setPosition(nextPosition);
        }
      }

      if (event.key === 'ArrowDown') {
        stepDown();
      }

      if (event.key === 'ArrowUp') {
        const rotated = rotatePiece(piece);
        if (canMove(rotated, position)) {
          setPiece(prev => ({ ...prev, cells: rotated }));
        }
      }

      if (event.key === ' ') {
        let dropY = position.y;
        while (canMove(piece.cells, { x: position.x, y: dropY + 1 })) {
          dropY += 1;
        }
        const nextBoard = board.map(row => [...row]);

        piece.cells.forEach(([cellX, cellY]) => {
          const x = position.x + cellX;
          const y = dropY + cellY;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            nextBoard[y][x] = piece.color;
          }
        });

        const filteredRows = nextBoard.filter(row => row.some(cell => !cell));
        const cleared = BOARD_HEIGHT - filteredRows.length;

        while (filteredRows.length < BOARD_HEIGHT) {
          filteredRows.unshift(Array(BOARD_WIDTH).fill(''));
        }

        setBoard(filteredRows);
        if (cleared > 0) {
          setLines(prev => prev + cleared);
          setScore(prev => prev + cleared * 100);
        }
        spawnPiece(filteredRows);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [TetrisExpand.show, TetrisExpand.hide, TetrisExpand.focusItem, piece, position, board, gameOver]);

  const displayBoard = useMemo(() => {
    const composedBoard = board.map(row => [...row]);
    piece.cells.forEach(([cellX, cellY]) => {
      const x = position.x + cellX;
      const y = position.y + cellY;
      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        composedBoard[y][x] = piece.color;
      }
    });
    return composedBoard;
  }, [board, piece, position]);

  return (
    <Draggable
      axis="both"
      handle=".retro-game-dragbar"
      grid={[1, 1]}
      scale={1}
      disabled={TetrisExpand.expand}
      bounds={{ top: 0 }}
      defaultPosition={{
        x: window.innerWidth <= 500 ? 12 : 320,
        y: window.innerWidth <= 500 ? 110 : 90,
      }}
      onStop={handleDragStop}
      onStart={() => handleSetFocusItemTrue('Tetris')}
    >
      <div
        className="retro-game-window"
        onClick={e => {
          e.stopPropagation();
          handleSetFocusItemTrue('Tetris');
        }}
        style={TetrisExpand.expand ? inlineStyleExpand('Tetris') : inlineStyle('Tetris')}
      >
        <div
          className="retro-game-dragbar"
          onDoubleClick={toggleExpand}
          style={{ background: TetrisExpand.focusItem ? themeDragBar : '#757579' }}
        >
          <div className="retro-game-title folder_barname-project">
            <img src={tetrisLogo} alt="Tetris" />
            <span>Tetris</span>
          </div>
          <div className="retro-game-buttons folder_barbtn-project">
            <div
              onClick={!isTouchDevice ? e => {
                e.stopPropagation();
                setTetrisExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('Tetris');
              } : undefined}
              onTouchEnd={e => {
                e.stopPropagation();
                setTetrisExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('Tetris');
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
              <div className={`expand-project ${TetrisExpand.expand ? 'full' : ''}`}></div>
              {TetrisExpand.expand ? <div className="expand_2-project"></div> : null}
            </div>
            <div>
              <p
                className="x-project"
                onClick={!isTouchDevice ? e => {
                  e.stopPropagation();
                  deleteTap('Tetris');
                } : undefined}
                onTouchEnd={e => {
                  e.stopPropagation();
                  deleteTap('Tetris');
                }}
              >
                ×
              </p>
            </div>
          </div>
        </div>

        <div className="retro-game-menu">
          <p>Game</p>
          <p>Options</p>
          <p>Help</p>
        </div>

        <div className="retro-game-body">
          <div className="retro-game-panel">
            <div className="retro-game-toolbar">
              <button onClick={resetGame}>{gameOver ? 'Restart' : 'New Game'}</button>
              <button onClick={() => setRunning(prev => !prev)}>{running ? 'Pause' : 'Resume'}</button>
            </div>
            <div className="tetris-layout">
              <div className="tetris-board">
                {displayBoard.flat().map((cell, index) => (
                  <div
                    key={index}
                    className="tetris-cell"
                    style={{ background: cell || '#0e0e0e' }}
                  />
                ))}
              </div>
              <div className="tetris-sidebar">
                <div className="retro-game-stats">
                  <span>Score: {score}</span>
                  <span>Lines: {lines}</span>
                </div>
                <p className="retro-game-status">
                  {gameOver ? 'Game over' : running ? 'Keyboard ready' : 'Paused'}
                </p>
                <p className="tetris-controls">
                  Controls:
                  <br />
                  Left / Right: Move
                  <br />
                  Up: Rotate
                  <br />
                  Down: Drop faster
                  <br />
                  Space: Hard drop
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
}

export default Tetris;
