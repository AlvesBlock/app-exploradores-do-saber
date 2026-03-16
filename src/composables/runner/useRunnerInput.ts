import { onBeforeUnmount, onMounted } from 'vue'
import type { RunnerGameState } from '@/types/runner-state'

interface RunnerInputActions {
  onStart: () => void
  onPauseToggle: () => void
  onShield?: () => void
  canMove?: () => boolean
  getLaneSwitchCooldownMs?: () => number
}

export function useRunnerInput(
  gameState: RunnerGameState,
  actions: RunnerInputActions
) {
  let lastMoveAt = 0

  function canMoveLane() {
    if (actions.canMove) {
      return actions.canMove()
    }

    return gameState.status === 'running'
  }

  function tryMove(delta: -1 | 1) {
    if (!canMoveLane()) {
      return
    }

    const now = performance.now()
    const cooldown = actions.getLaneSwitchCooldownMs?.() ?? 110

    if (now - lastMoveAt < cooldown) {
      return
    }

    lastMoveAt = now
    gameState.player.lane = Math.min(2, Math.max(0, gameState.player.lane + delta)) as 0 | 1 | 2
  }

  function moveLeft() {
    tryMove(-1)
  }

  function moveRight() {
    tryMove(1)
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
      return
    }

    if (event.code === 'Space') {
      event.preventDefault()
      actions.onShield?.()
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
