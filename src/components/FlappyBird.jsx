import { useContext, useEffect, useMemo, useState } from 'react';
import Draggable from 'react-draggable';
import UseContext from '../Context';
import flappyBirdLogo from '../assets/flappybird.png';
import '../css/RetroGames.css';

const GAME_WIDTH = 360;
const GAME_HEIGHT = 420;
const BIRD_X = 88;
const PIPE_WIDTH = 56;
const PIPE_GAP = 138;

function createPipes() {
  return [
    { x: 360, topHeight: 110, passed: false },
    { x: 560, topHeight: 190, passed: false },
    { x: 760, topHeight: 150, passed: false },
  ];
}

function randomPipeHeight() {
  return 70 + Math.floor(Math.random() * 180);
}

function FlappyBird() {
  const {
    themeDragBar,
    FlappyBirdExpand,
    setFlappyBirdExpand,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
  } = useContext(UseContext);

  const [birdY, setBirdY] = useState(180);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState(createPipes);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  function handleDragStop(event, data) {
    setFlappyBirdExpand(prev => ({ ...prev, x: data.x, y: data.y }));
  }

  function toggleExpand() {
    setFlappyBirdExpand(prev => ({ ...prev, expand: !prev.expand }));
  }

  function resetGame() {
    setBirdY(180);
    setVelocity(0);
    setPipes(createPipes());
    setScore(0);
    setGameOver(false);
    setRunning(false);
  }

  function flap() {
    if (gameOver) {
      resetGame();
      return;
    }

    setRunning(true);
    setVelocity(-8.5);
  }

  useEffect(() => {
    if (!FlappyBirdExpand.show || FlappyBirdExpand.hide || !running || gameOver) return undefined;

    const timer = setTimeout(() => {
      setVelocity(prev => prev + 0.65);
      setBirdY(prev => prev + velocity);

      setPipes(prevPipes =>
        prevPipes.map(pipe => ({ ...pipe, x: pipe.x - 4 })).map(pipe => {
          if (pipe.x + PIPE_WIDTH < 0) {
            return {
              x: GAME_WIDTH + 120,
              topHeight: randomPipeHeight(),
              passed: false,
            };
          }

          return pipe;
        })
      );
    }, 32);

    return () => clearTimeout(timer);
  }, [FlappyBirdExpand.show, FlappyBirdExpand.hide, running, gameOver, velocity, birdY]);

  useEffect(() => {
    if (!running || gameOver) return;

    if (birdY <= 0 || birdY >= GAME_HEIGHT - 28) {
      setGameOver(true);
      setRunning(false);
    }
  }, [birdY, running, gameOver]);

  useEffect(() => {
    if (!running || gameOver) return;

    setPipes(prevPipes => {
      let didScore = false;

      const updatedPipes = prevPipes.map(pipe => {
        const birdTop = birdY;
        const birdBottom = birdY + 28;
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + PIPE_WIDTH;
        const hitsPipe = BIRD_X + 28 > pipeLeft && BIRD_X < pipeRight;
        const hitsTop = birdTop < pipe.topHeight;
        const hitsBottom = birdBottom > pipe.topHeight + PIPE_GAP;

        if (hitsPipe && (hitsTop || hitsBottom)) {
          setGameOver(true);
          setRunning(false);
        }

        if (!pipe.passed && pipeRight < BIRD_X) {
          didScore = true;
          return { ...pipe, passed: true };
        }

        return pipe;
      });

      if (didScore) {
        setScore(prev => prev + 1);
      }

      return updatedPipes;
    });
  }, [pipes, birdY, running, gameOver]);

  useEffect(() => {
    if (!FlappyBirdExpand.show || FlappyBirdExpand.hide || !FlappyBirdExpand.focusItem) return undefined;

    function handleKeyDown(event) {
      if (event.code === 'Space' || event.key === 'ArrowUp') {
        event.preventDefault();
        flap();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [FlappyBirdExpand.show, FlappyBirdExpand.hide, FlappyBirdExpand.focusItem, gameOver]);

  const status = gameOver
    ? 'Game over. Press Jump to restart.'
    : running
      ? 'Press Space or Jump to stay alive.'
      : 'Press Jump to start.';

  const backgroundStyle = useMemo(
    () => ({
      width: `${GAME_WIDTH}px`,
      height: `${GAME_HEIGHT}px`,
    }),
    []
  );

  return (
    <Draggable
      axis="both"
      handle=".retro-game-dragbar"
      grid={[1, 1]}
      scale={1}
      disabled={FlappyBirdExpand.expand}
      bounds={{ top: 0 }}
      defaultPosition={{
        x: window.innerWidth <= 500 ? 10 : 420,
        y: window.innerWidth <= 500 ? 110 : 120,
      }}
      onStop={handleDragStop}
      onStart={() => handleSetFocusItemTrue('FlappyBird')}
    >
      <div
        className="retro-game-window"
        onClick={e => {
          e.stopPropagation();
          handleSetFocusItemTrue('FlappyBird');
        }}
        style={FlappyBirdExpand.expand ? inlineStyleExpand('FlappyBird') : inlineStyle('FlappyBird')}
      >
        <div
          className="retro-game-dragbar"
          onDoubleClick={toggleExpand}
          style={{ background: FlappyBirdExpand.focusItem ? themeDragBar : '#757579' }}
        >
          <div className="retro-game-title folder_barname-project">
            <img src={flappyBirdLogo} alt="FlappyBird" />
            <span>Flappy Bird</span>
          </div>
          <div className="retro-game-buttons folder_barbtn-project">
            <div
              onClick={!isTouchDevice ? e => {
                e.stopPropagation();
                setFlappyBirdExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('FlappyBird');
              } : undefined}
              onTouchEnd={e => {
                e.stopPropagation();
                setFlappyBirdExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('FlappyBird');
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
              <div className={`expand-project ${FlappyBirdExpand.expand ? 'full' : ''}`}></div>
              {FlappyBirdExpand.expand ? <div className="expand_2-project"></div> : null}
            </div>
            <div>
              <p
                className="x-project"
                onClick={!isTouchDevice ? e => {
                  e.stopPropagation();
                  deleteTap('FlappyBird');
                } : undefined}
                onTouchEnd={e => {
                  e.stopPropagation();
                  deleteTap('FlappyBird');
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
              <button onClick={flap}>{gameOver ? 'Restart' : 'Jump'}</button>
              <button onClick={resetGame}>Reset</button>
              <div className="retro-game-stats">
                <span>Score: {score}</span>
              </div>
            </div>
            <p className="retro-game-status">{status}</p>

            <div className="flappy-stage" style={backgroundStyle}>
              {pipes.map((pipe, index) => (
                <div key={`${pipe.x}-${index}`}>
                  <div
                    className="flappy-pipe flappy-pipe-top"
                    style={{ left: `${pipe.x}px`, width: `${PIPE_WIDTH}px`, height: `${pipe.topHeight}px` }}
                  />
                  <div
                    className="flappy-pipe flappy-pipe-bottom"
                    style={{
                      left: `${pipe.x}px`,
                      width: `${PIPE_WIDTH}px`,
                      height: `${GAME_HEIGHT - pipe.topHeight - PIPE_GAP}px`,
                      top: `${pipe.topHeight + PIPE_GAP}px`,
                    }}
                  />
                </div>
              ))}
              <div className="flappy-bird" style={{ left: `${BIRD_X}px`, top: `${birdY}px` }} />
              <div className="flappy-ground" />
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
}

export default FlappyBird;
