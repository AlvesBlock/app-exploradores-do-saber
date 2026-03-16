import { describe, expect, it } from 'vitest'
import { getRunnerRoundConfig } from '@/engine/runner/data/rounds'
import {
  buildRunnerDifficultySnapshot,
  estimateTargetDistance,
  resolvePhaseLevel
} from '@/engine/runner/runtime/difficulty'

describe('runner difficulty', () => {
  it('starts the first round at a slow and readable pace', () => {
    const round = getRunnerRoundConfig(1)
    const intro = buildRunnerDifficultySnapshot(round, 0, false)
    const late = buildRunnerDifficultySnapshot(round, 0.9, false)

    expect(intro.speed).toBe(round.baseSpeed)
    expect(intro.speed).toBeLessThan(0.9)
    expect(intro.collectibleIntervalMs).toBeGreaterThan(late.collectibleIntervalMs)
    expect(intro.obstacleIntervalMs).toBeGreaterThan(late.obstacleIntervalMs)
  })

  it('keeps phase progression controlled and predictable', () => {
    expect(resolvePhaseLevel(0.1)).toBe(1)
    expect(resolvePhaseLevel(0.5)).toBe(2)
    expect(resolvePhaseLevel(0.85)).toBe(3)
  })

  it('estimates a target distance compatible with round duration', () => {
    const round = getRunnerRoundConfig(4)
    expect(estimateTargetDistance(round)).toBeGreaterThan(round.durationSeconds * 10)
  })
})
