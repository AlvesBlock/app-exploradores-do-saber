import { describe, expect, it } from 'vitest'
import { RUNNER_DEFAULT_STATE } from '@/engine/runner/constants'
import { resolveRunnerCollision } from '@/engine/runner/runtime/collision'
import { applyRoundConfigToState } from '@/engine/runner/utils/round-state'
import type { RunnerEntity, RunnerGameState } from '@/types/runner-state'

function makeState(): RunnerGameState {
  const state = structuredClone(RUNNER_DEFAULT_STATE)
  applyRoundConfigToState(state, 1)
  return state
}

describe('runner collisions', () => {
  it('treats risky collectibles without shield as non-qualified handling', () => {
    const state = makeState()
    const riskyGlass: RunnerEntity = {
      id: 'glass',
      type: 'collectible',
      lane: 1,
      depth: 1,
      emoji: '🍾',
      active: true,
      kindId: 'glass_bottle',
      isQualifiedCollect: true,
      coinValue: 3,
      ecoScoreValue: 2,
      carbonCreditValue: 1,
      shieldChargeGain: 1,
      wrongHandlingPenalty: 2,
      feedbackText: 'Vidro sem protecao exige cuidado.',
      collectibleClass: 'risky',
      requiresShieldForQualified: true
    }

    const result = resolveRunnerCollision(state, riskyGlass)

    expect(state.stats.qualifiedCollects).toBe(0)
    expect(state.stats.invalidCollects).toBe(1)
    expect(result.feedback?.tone).toBe('warning')
  })

  it('rewards shielded risky collectibles as qualified plays', () => {
    const state = makeState()
    state.player.shieldActive = true

    const riskyBattery: RunnerEntity = {
      id: 'battery',
      type: 'collectible',
      lane: 1,
      depth: 1,
      emoji: '🔋',
      active: true,
      kindId: 'battery',
      isQualifiedCollect: true,
      coinValue: 5,
      ecoScoreValue: 5,
      carbonCreditValue: 2,
      shieldChargeGain: 2,
      wrongHandlingPenalty: 3,
      feedbackText: 'Residuo perigoso coletado com protecao.',
      collectibleClass: 'special',
      requiresShieldForQualified: true
    }

    resolveRunnerCollision(state, riskyBattery)

    expect(state.stats.qualifiedCollects).toBe(1)
    expect(state.stats.specialCollects).toBe(1)
    expect(state.stats.invalidCollects).toBe(0)
    expect(state.stats.carbonCredits).toBeGreaterThan(0)
  })

  it('lets the shield block one obstacle hit', () => {
    const state = makeState()
    state.player.shieldActive = true
    state.player.shieldTimeLeft = 3

    const obstacle: RunnerEntity = {
      id: 'obstacle',
      type: 'obstacle',
      lane: 1,
      depth: 1,
      emoji: '🚧',
      active: true,
      obstacleSeverity: 'major',
      scorePenalty: 28
    }

    const result = resolveRunnerCollision(state, obstacle)

    expect(result.shieldBlocked).toBe(true)
    expect(state.stats.lives).toBe(3)
    expect(state.player.shieldActive).toBe(false)
  })
})
