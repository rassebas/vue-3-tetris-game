<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ActivePiece } from '../types/tetris';

const props = defineProps<{
  board: string[][];
  activePiece: ActivePiece | null;
}>();

const clearingRows = ref<Set<number>>(new Set());

const mergedBoard = computed(() => {
  const result = props.board.map(row => [...row]);
  
  if (props.activePiece) {
    const { shape, position, color } = props.activePiece;
    
    shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0 && boardY < result.length && boardX >= 0 && boardX < result[0].length) {
            result[boardY][boardX] = color;
          }
        }
      });
    });
  }
  
  return result;
});

watch(() => props.board, (newBoard, oldBoard) => {
  if (!oldBoard) return;
  
  const newClearingRows = new Set<number>();
  newBoard.forEach((row, index) => {
    if (row.every(cell => cell !== '')) {
      newClearingRows.add(index);
    }
  });
  
  if (newClearingRows.size > 0) {
    clearingRows.value = newClearingRows;
    setTimeout(() => {
      clearingRows.value = new Set();
    }, 150);
  }
}, { deep: true });
</script>

<template>
  <div class="tetris-board">
    <div 
      v-for="(row, y) in mergedBoard" 
      :key="y" 
      class="row"
      :class="{ 'clearing': clearingRows.has(y) }"
    >
      <div
        v-for="(cell, x) in row"
        :key="x"
        class="cell"
        :class="{ filled: cell !== '' }"
        :style="{
          backgroundColor: cell || 'transparent',
          boxShadow: cell ? `inset -4px -4px 0 rgba(0,0,0,0.2), inset 4px 4px 0 rgba(255,255,255,0.1)` : 'none'
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.tetris-board {
  border: 2px solid #333;
  background-color: #111;
  padding: 2px;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
}

.row {
  display: flex;
}

.row.clearing {
  animation: glow 0.15s ease-in-out;
}

.cell {
  width: 30px;
  height: 30px;
  border: 1px solid #222;
  transition: background-color 0.1s ease;
  position: relative;
}

.cell.filled {
  transform: translateZ(0);
  border-radius: 2px;
}

@keyframes glow {
  0% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(2);
  }
  100% {
    filter: brightness(1);
  }
}
</style>