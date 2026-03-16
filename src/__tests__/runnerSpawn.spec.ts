import { describe, expect, it } from 'vitest'
import { RUNNER_DEFAULT_STATE } from '@/engine/runner/constants'
import { createRunnerSpawnRuntime, updateRunnerSpawnRuntime } from '@/engine/runner/runtime/spawn-manager'
import { buildRunnerDifficultySnapshot } from '@/engine/runner/runtime/difficulty'
import { applyRoundConfigToState } from '@/engine/runner/utils/round-state'
import type { RunnerGameState } from '@/types/runner-state'

function makeState(): RunnerGameState {
  const state = structuredClone(RUNNER_DEFAULT_STATE)
  applyRoundConfigToState(state, 1)
  return state
}

describe('runner spawn manager', () => {
  it('spawns only collectibles during the tutorial window', () => {
    const state = makeState()
    const runtime = createRunnerSpawnRuntime()
    const snapshot = buildRunnerDifficultySnapshot(state.roundProgress.currentRoundConfig, 0, false)

    runtime.collectibleTimer = snapshot.collectibleIntervalMs
    runtime.obstacleTimer = snapshot.obstacleIntervalMs

    const spawned = updateRunnerSpawnRuntime(state, runtime, snapshot, 16, () => 0.1)

    expect(spawned.length).toBeGreaterThan(0)
    expect(spawned.every((entity) => entity.type === 'collectible')).toBe(true)
  })

  it('keeps a safe lane when two obstacle lanes are already threatened', () => {
    const state = makeState()
    state.telemetry.elapsedMs = state.roundProgress.currentRoundConfig.tutorialWindowSeconds * 1000 + 100
    state.entities.push(
      { id: 'a', type: 'obstacle', lane: 0, depth: 0.3, emoji: '🚧', active: true },
      { id: 'b', type: 'obstacle', lane: 1, depth: 0.4, emoji: '🛑', active: true }
    )

    const runtime = createRunnerSpawnRuntime()
    const snapshot = buildRunnerDifficultySnapshot(state.roundProgress.currentRoundConfig, 0.6, false)
    runtime.obstacleTimer = snapshot.obstacleIntervalMs
    runtime.collectibleTimer = 0

    const spawned = updateRunnerSpawnRuntime(state, runtime, snapshot, 16, () => 0.2)

    expect(spawned.some((entity) => entity.type === 'obstacle')).toBe(false)
  })
})
