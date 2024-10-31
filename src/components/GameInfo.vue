<script setup lang="ts">
import type { GameState } from '../types/tetris';

defineProps<{
  gameState: GameState;
}>();

defineEmits<{
  (e: 'restart'): void;
}>();
</script>

<template>
  <div class="game-info">
    <div class="stats">
      <p>Score: {{ gameState.score }}</p>
      <p>Level: {{ gameState.level }}</p>
    </div>
    
    <div v-if="gameState.isGameOver" class="game-over">
      <h2>Game Over!</h2>
      <button @click="$emit('restart')">Play Again</button>
    </div>
    
    <div v-if="gameState.isPaused" class="paused">
      <h2>Paused</h2>
    </div>
    
    <div class="controls">
      <h3>Controls:</h3>
      <p>← → : Move</p>
      <p>↑ : Rotate</p>
      <p>↓ : Soft Drop</p>
      <p>Space : Hard Drop</p>
      <p>P : Pause</p>
    </div>
  </div>
</template>

<style scoped>
.game-info {
  padding: 20px;
  background-color: #222;
  border-radius: 8px;
  margin-left: 20px;
}

.stats {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.game-over, .paused {
  text-align: center;
  margin: 20px 0;
}

button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.controls {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #444;
}

.controls p {
  margin: 5px 0;
}
</style>