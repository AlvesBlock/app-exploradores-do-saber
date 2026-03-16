import type {
  RunnerRoundConfig,
  RunnerRoundEconomyResult,
  RunnerRoundPerformanceInput
} from '@/types/runner-game'

function clampMin(value: number, min = 0): number {
  return Math.max(min, value)
}

function safeFloor(value: number): number {
  return Math.floor(Number.isFinite(value) ? value : 0)
}

export function getMissedTargetAmount(
  qualifiedCollects: number,
  targetQualifiedCollects: number
): number {
  return clampMin(targetQualifiedCollects - qualifiedCollects, 0)
}

export function isRoundVictory(input: RunnerRoundPerformanceInput): boolean {
  const survivedRound = input.timeRemainingSeconds >= 0 && input.livesRemaining > 0
  const targetReached = input.qualifiedCollects >= input.targetQualifiedCollects

  return survivedRound && targetReached
}

export function calculateDistanceScore(distanceTravelled: number): number {
  return safeFloor(distanceTravelled * 0.8)
}

export function calculateQualifiedCollectScore(qualifiedCollects: number): number {
  return qualifiedCollects * 25
}

export function calculateEcoScorePoints(ecoScore: number): number {
  return ecoScore * 18
}

export function calculateTimeBonus(
  victoryAchieved: boolean,
  timeRemainingSeconds: number
): number {
  if (!victoryAchieved) return 0
  return safeFloor(timeRemainingSeconds * 6)
}

export function calculateVictoryBonus(
  victoryAchieved: boolean,
  roundNumber: number
): number {
  if (!victoryAchieved) return 0
  return 250 + roundNumber * 40
}

export function calculateShieldEfficiencyBonus(shieldBlocks: number): number {
  return shieldBlocks * 35
}

export function calculateRoundBonus(roundNumber: number): number {
  return roundNumber * 30
}

export function calculateCollisionPenalty(collisionsTaken: number): number {
  return collisionsTaken * 45
}

export function calculateMissedTargetPenalty(
  victoryAchieved: boolean,
  missedTargetAmount: number
): number {
  if (victoryAchieved) return 0
  return missedTargetAmount * 30
}

export function calculateScoreFinal(
  input: RunnerRoundPerformanceInput
): number {
  const victoryAchieved = isRoundVictory(input)
  const missedTargetAmount = getMissedTargetAmount(
    input.qualifiedCollects,
    input.targetQualifiedCollects
  )

  const rawScore =
    calculateDistanceScore(input.distanceTravelled) +
    calculateQualifiedCollectScore(input.qualifiedCollects) +
    calculateEcoScorePoints(input.ecoScore) +
    calculateTimeBonus(victoryAchieved, input.timeRemainingSeconds) +
    calculateVictoryBonus(victoryAchieved, input.roundNumber) +
    calculateShieldEfficiencyBonus(input.shieldBlocks) +
    calculateRoundBonus(input.roundNumber) -
    calculateCollisionPenalty(input.collisionsTaken) -
    calculateMissedTargetPenalty(victoryAchieved, missedTargetAmount)

  return clampMin(safeFloor(rawScore), 0)
}

export function calculateCarbonCreditsEarned(
  input: RunnerRoundPerformanceInput,
  roundConfig: RunnerRoundConfig
): number {
  const victoryAchieved = isRoundVictory(input)

  if (victoryAchieved) {
    const total =
      roundConfig.victoryCarbonCredits +
      safeFloor(input.ecoScore / 4) +
      safeFloor(input.qualifiedCollects / 6) -
      safeFloor(input.collisionsTaken / 2)

    return clampMin(total, 0)
  }

  const total =
    safeFloor(input.ecoScore / 6) -
    safeFloor(input.collisionsTaken / 2)

  return clampMin(total, 0)
}

export function calculateCoinsEarned(
  input: RunnerRoundPerformanceInput,
  roundConfig: RunnerRoundConfig
): number {
  const victoryAchieved = isRoundVictory(input)

  if (victoryAchieved) {
    return input.coinsCollected + roundConfig.victoryCoins
  }

  const consolationCoins = Math.min(
    5 + input.roundNumber * 2,
    Math.max(0, safeFloor(input.coinsCollected * 0.25))
  )

  return input.coinsCollected + consolationCoins
}

export function calculateTimeSpentSeconds(
  baseRoundDurationSeconds: number,
  timeRemainingSeconds: number
): number {
  return clampMin(baseRoundDurationSeconds - Math.max(timeRemainingSeconds, 0), 0)
}

export function calculateRunnerRoundEconomyResult(
  input: RunnerRoundPerformanceInput,
  roundConfig: RunnerRoundConfig
): RunnerRoundEconomyResult {
  const victoryAchieved = isRoundVictory(input)
  const missedTargetAmount = getMissedTargetAmount(
    input.qualifiedCollects,
    input.targetQualifiedCollects
  )

  return {
    completionStatus: victoryAchieved ? 'victory' : 'defeat',
    scoreFinal: calculateScoreFinal(input),
    carbonCreditsEarned: calculateCarbonCreditsEarned(input, roundConfig),
    coinsEarned: calculateCoinsEarned(input, roundConfig),
    missedTargetAmount,
    timeSpentSeconds: calculateTimeSpentSeconds(
      input.baseRoundDurationSeconds,
      input.timeRemainingSeconds
    ),
    victoryAchieved
  }
}