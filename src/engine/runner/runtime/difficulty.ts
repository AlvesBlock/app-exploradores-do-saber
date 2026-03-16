import type { RunnerRoundConfig } from '@/types/runner-game'
import type { RunnerPhaseLevel } from '@/types/runner-state'

export interface RunnerDifficultySnapshot {
  phaseLevel: RunnerPhaseLevel
  speed: number
  entityMovement: number
  roadMovement: number
  collectibleIntervalMs: number
  obstacleIntervalMs: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function easeInOut(progress: number): number {
  const clamped = clamp(progress, 0, 1)
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2
}

export function resolvePhaseLevel(progressRatio: number): RunnerPhaseLevel {
  if (progressRatio >= 0.72) {
    return 3
  }

  if (progressRatio >= 0.36) {
    return 2
  }

  return 1
}

export function estimateTargetDistance(roundConfig: RunnerRoundConfig): number {
  const averageSpeed = (roundConfig.baseSpeed + roundConfig.maxSpeed) / 2
  const distancePerSecond = 14 + averageSpeed * 7
  return Math.round(roundConfig.durationSeconds * distancePerSecond)
}

export function buildRunnerDifficultySnapshot(
  roundConfig: RunnerRoundConfig,
  progressRatio: number,
  shieldActive: boolean
): RunnerDifficultySnapshot {
  const easedProgress = easeInOut(progressRatio)
  const phaseLevel = resolvePhaseLevel(progressRatio)
  const phaseSpeedBonus = phaseLevel === 3 ? 0.08 : phaseLevel === 2 ? 0.04 : 0
  const shieldSpeedBonus = shieldActive ? 0.04 : 0
  const speed = Math.min(
    roundConfig.maxSpeed + phaseSpeedBonus,
    roundConfig.baseSpeed + (roundConfig.maxSpeed - roundConfig.baseSpeed) * easedProgress + shieldSpeedBonus
  )

  const collectibleReduction = phaseLevel === 3 ? 0.14 : phaseLevel === 2 ? 0.08 : 0
  const obstacleReduction = phaseLevel === 3 ? 0.2 : phaseLevel === 2 ? 0.12 : 0
  const entityMovement = 0.0064 + speed * 0.0042
  const roadMovement = 0.0038 + speed * 0.0032 + (shieldActive ? 0.0008 : 0)

  return {
    phaseLevel,
    speed: Number(speed.toFixed(2)),
    entityMovement,
    roadMovement,
    collectibleIntervalMs: Math.round(roundConfig.collectibleIntervalMs * (1 - collectibleReduction)),
    obstacleIntervalMs: Math.round(roundConfig.obstacleIntervalMs * (1 - obstacleReduction))
  }
}
