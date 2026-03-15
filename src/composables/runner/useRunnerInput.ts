import { onBeforeUnmount, onMounted } from 'vue'
import type { RunnerGameState } from '@/types/runner'

interface RunnerInputActions {
  onStart: () => void
  onPauseToggle: () => void
}

export function useRunnerInput(
  gameState: RunnerGameState,
  actions: RunnerInputActions
) {
  function moveLeft() {
    gameState.player.lane = Math.max(0, gameState.player.lane - 1) as 0 | 1 | 2
  }

  function moveRight() {
    gameState.player.lane = Math.min(2, gameState.player.lane + 1) as 0 | 1 | 2
  }

  function handleKeydown(event: KeyboardEvent) {
    const key = event.key.toLowerCase()

    if (key === 'arrowleft' || key === 'a') {
      moveLeft()
      return
    }

    if (key === 'arrowright' || key === 'd') {
      moveRight()
      return
    }

    if (key === 'enter') {
      actions.onStart()
      return
    }

    if (key === 'p') {
      actions.onPauseToggle()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    moveLeft,
    moveRight
  }
}