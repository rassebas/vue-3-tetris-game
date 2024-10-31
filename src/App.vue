<script setup lang="ts">
import TetrisBoard from './components/TetrisBoard.vue';
import GameInfo from './components/GameInfo.vue';
import { useTetrisGame } from './composables/useTetrisGame';

const { board, activePiece, gameState, startGame } = useTetrisGame();
</script>

<template>
  <div class="game-container">
    <TetrisBoard :board="board" :active-piece="activePiece" />
    <GameInfo :game-state="gameState" @restart="startGame" />
  </div>
</template>

<style>
:root {
  color-scheme: dark;
}

body {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #fff;
  font-family: Arial, sans-serif;
}

.game-container {
  display: flex;
  gap: 20px;
  padding: 20px;
}
</style>