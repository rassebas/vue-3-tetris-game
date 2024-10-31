import { TetrisBlock } from '../types/tetris';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const TICK_SPEED_MS = 1000;

export const TETROMINOES: Record<string, TetrisBlock> = {
  I: {
    shape: [
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
      [false, false, false, false],
    ],
    color: '#00f0f0'
  },
  O: {
    shape: [
      [true, true],
      [true, true],
    ],
    color: '#f0f000'
  },
  T: {
    shape: [
      [false, true, false],
      [true, true, true],
      [false, false, false],
    ],
    color: '#a000f0'
  },
  S: {
    shape: [
      [false, true, true],
      [true, true, false],
      [false, false, false],
    ],
    color: '#00f000'
  },
  Z: {
    shape: [
      [true, true, false],
      [false, true, true],
      [false, false, false],
    ],
    color: '#f00000'
  },
  J: {
    shape: [
      [true, false, false],
      [true, true, true],
      [false, false, false],
    ],
    color: '#0000f0'
  },
  L: {
    shape: [
      [false, false, true],
      [true, true, true],
      [false, false, false],
    ],
    color: '#f0a000'
  },
};