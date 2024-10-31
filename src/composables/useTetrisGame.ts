import { ref, computed, onMounted, onUnmounted } from 'vue';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOES, TICK_SPEED_MS } from '../constants/tetrominos';
import type { Position, GameState, TetrominoType, ActivePiece } from '../types/tetris';

export function useTetrisGame() {
  const gameState = ref<GameState>({
    score: 0,
    level: 1,
    isGameOver: false,
    isPaused: false
  });

  const board = ref<string[][]>(
    Array(BOARD_HEIGHT).fill(null).map(() => 
      Array(BOARD_WIDTH).fill('')
    )
  );

  const activePiece = ref<ActivePiece | null>(null);
  let gameInterval: number | null = null;

  const createNewPiece = () => {
    const types = Object.keys(TETROMINOES) as TetrominoType[];
    const type = types[Math.floor(Math.random() * types.length)];
    const tetromino = TETROMINOES[type];

    activePiece.value = {
      type,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      rotation: 0,
      shape: tetromino.shape,
      color: tetromino.color
    };
  };

  const canMove = (offsetX: number, offsetY: number): boolean => {
    if (!activePiece.value) return false;

    const { shape, position } = activePiece.value;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = position.x + x + offsetX;
          const newY = position.y + y + offsetY;

          if (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board.value[newY][newX] !== '')
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const rotatePiece = () => {
    if (!activePiece.value) return;

    const rotated = activePiece.value.shape[0].map((_, index) =>
      activePiece.value!.shape.map(row => row[index]).reverse()
    );

    const originalShape = activePiece.value.shape;
    activePiece.value.shape = rotated;

    if (!canMove(0, 0)) {
      activePiece.value.shape = originalShape;
    }
  };

  const mergePiece = () => {
    if (!activePiece.value) return;

    const { shape, position, color } = activePiece.value;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0) {
            board.value[boardY][boardX] = color;
          }
        }
      }
    }

    checkLines();
    createNewPiece();

    if (!canMove(0, 0)) {
      gameState.value.isGameOver = true;
      stopGame();
    }
  };

  const checkLines = () => {
    let linesCleared = 0;

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (board.value[y].every(cell => cell !== '')) {
        board.value.splice(y, 1);
        board.value.unshift(Array(BOARD_WIDTH).fill(''));
        linesCleared++;
        y++;
      }
    }

    if (linesCleared > 0) {
      gameState.value.score += linesCleared * 100 * gameState.value.level;
      gameState.value.level = Math.floor(gameState.value.score / 1000) + 1;
    }
  };

  const moveLeft = () => {
    if (canMove(-1, 0)) {
      activePiece.value!.position.x--;
    }
  };

  const moveRight = () => {
    if (canMove(1, 0)) {
      activePiece.value!.position.x++;
    }
  };

  const moveDown = () => {
    if (canMove(0, 1)) {
      activePiece.value!.position.y++;
    } else {
      mergePiece();
    }
  };

  const hardDrop = () => {
    while (canMove(0, 1)) {
      activePiece.value!.position.y++;
    }
    mergePiece();
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (gameState.value.isGameOver || gameState.value.isPaused) return;

    switch (event.key) {
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowUp':
        rotatePiece();
        break;
      case ' ':
        hardDrop();
        break;
      case 'p':
        togglePause();
        break;
    }
  };

  const startGame = () => {
    gameState.value = {
      score: 0,
      level: 1,
      isGameOver: false,
      isPaused: false
    };
    board.value = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''));
    createNewPiece();
    gameInterval = setInterval(() => {
      if (!gameState.value.isPaused) {
        moveDown();
      }
    }, TICK_SPEED_MS / gameState.value.level);
  };

  const stopGame = () => {
    if (gameInterval) {
      clearInterval(gameInterval);
      gameInterval = null;
    }
  };

  const togglePause = () => {
    gameState.value.isPaused = !gameState.value.isPaused;
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
    startGame();
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
    stopGame();
  });

  return {
    board,
    activePiece,
    gameState,
    startGame,
    togglePause
  };
}