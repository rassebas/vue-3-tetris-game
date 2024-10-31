export interface Position {
  x: number;
  y: number;
}

export interface TetrisBlock {
  shape: boolean[][];
  color: string;
}

export interface GameState {
  score: number;
  level: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface ActivePiece {
  type: TetrominoType;
  position: Position;
  rotation: number;
  shape: boolean[][];
  color: string;
}