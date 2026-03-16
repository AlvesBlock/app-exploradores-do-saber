import { createInitialRoadMarkers } from '@/engine/runner/constants'
import { getRunnerRoundConfig } from '@/engine/runner/data/rounds'
import { RUNNER_VEHICLES } from '@/engine/runner/data/vehicles'
import { estimateTargetDistance } from '@/engine/runner/runtime/difficulty'
import { pickEducationalCard } from '@/engine/runner/utils/cards'
import { calculateRunnerRoundEconomyResult } from '@/engine/runner/utils/scoring'
import type {
  EducationalCard,
  RunnerPersistentProgress,
  RunnerRankingEntry,
  RunnerRoundEndReason,
  RunnerRoundSummary
} from '@/types/runner-game'
import type {
  RunnerGameState,
  RunnerRoundProgressState
} from '@/types/runner-state'

export function buildRoundProgressState(roundNumber: number): RunnerRoundProgressState {
  const config = getRunnerRoundConfig(roundNumber)

  return {
    currentRound: roundNumber,
    currentRoundConfig: config,
    roundCompleted: false,
    completionStatus: null,
    endReason: null,
    finalCard: null,
    finalRankingEntry: null,
    finalSummaryText: null,
    finalResult: null
  }
}

export function syncRunnerPersistentProgress(
  gameState: RunnerGameState,
  progress: RunnerPersistentProgress
): void {
  const selectedVehicleTier =
    RUNNER_VEHICLES.find((vehicle) => vehicle.id === progress.selectedVehicleId)?.tier ?? 1

  gameState.meta.selectedVehicleId = progress.selectedVehicleId
  gameState.meta.unlockedVehicleIds = progress.unlockedVehicleIds
  gameState.meta.walletCoins = progress.totalCoins
  gameState.meta.walletCarbonCredits = progress.totalCarbonCredits
  gameState.meta.highestUnlockedRound = progress.highestUnlockedRound
  gameState.player.vehicleId = progress.selectedVehicleId
  gameState.player.vehicleLevel = Math.max(0, selectedVehicleTier - 1)
}

export function applyRoundConfigToState(
  gameState: RunnerGameState,
  roundNumber: number
): void {
  const roundConfig = getRunnerRoundConfig(roundNumber)

  gameState.roundProgress = buildRoundProgressState(roundNumber)

  gameState.player.lane = 1
  gameState.player.vehicleId = gameState.meta.selectedVehicleId
  gameState.player.vehicleLevel = Math.max(
    0,
    (RUNNER_VEHICLES.find((vehicle) => vehicle.id === gameState.meta.selectedVehicleId)?.tier ?? 1) - 1
  )
  gameState.player.shieldCharge = 0
  gameState.player.shieldChargeNeeded = roundConfig.shieldChargeNeeded
  gameState.player.shieldActive = false
  gameState.player.shieldTimeLeft = 0
  gameState.player.emergencyHealUsed = false

  gameState.stats.score = 0
  gameState.stats.coins = 0
  gameState.stats.lives = 3
  gameState.stats.distance = 0
  gameState.stats.speed = roundConfig.baseSpeed
  gameState.stats.timeLeft = roundConfig.durationSeconds
  gameState.stats.elapsedSeconds = 0
  gameState.stats.targetDistance = estimateTargetDistance(roundConfig)
  gameState.stats.minCollectibles = roundConfig.targetQualifiedCollects
  gameState.stats.collectedCount = 0
  gameState.stats.qualifiedCollects = 0
  gameState.stats.invalidCollects = 0
  gameState.stats.riskyCollects = 0
  gameState.stats.specialCollects = 0
  gameState.stats.ecoScore = 0
  gameState.stats.carbonCredits = 0
  gameState.stats.collisionsTaken = 0
  gameState.stats.shieldUses = 0
  gameState.stats.shieldBlocks = 0
  gameState.stats.phaseLevel = 1

  gameState.entities = []
  gameState.roadMarkers = createInitialRoadMarkers()
  gameState.telemetry.elapsedMs = 0
  gameState.telemetry.firstCollectAtMs = null
  gameState.telemetry.firstCollisionAtMs = null
  gameState.telemetry.collisionsByLane[0] = 0
  gameState.telemetry.collisionsByLane[1] = 0
  gameState.telemetry.collisionsByLane[2] = 0
  gameState.ui.lastFeedback = null
}

export function resetRoundTransientFeedback(gameState: RunnerGameState): void {
  gameState.roundProgress.roundCompleted = false
  gameState.roundProgress.completionStatus = null
  gameState.roundProgress.endReason = null
  gameState.roundProgress.finalCard = null
  gameState.roundProgress.finalRankingEntry = null
  gameState.roundProgress.finalSummaryText = null
  gameState.roundProgress.finalResult = null
}

export function resolveRoundBackground(roundNumber: number): string {
  return getRunnerRoundConfig(roundNumber).background
}

export function buildRoundSummaryText(summary: RunnerRoundSummary): string {
  if (summary.endReason === 'victory') {
    return 'Voce concluiu o percurso, bateu a meta e manteve a coleta sob controle.'
  }

  if (summary.endReason === 'missed_target') {
    return 'O percurso terminou, mas faltou coleta qualificada para fechar a rodada.'
  }

  if (summary.endReason === 'lives_depleted') {
    return 'As vidas acabaram antes do fim do percurso. O ritmo ficou acima do controle.'
  }

  return 'O tempo terminou antes de consolidar a rodada.'
}

export function finalizeRoundState(
  gameState: RunnerGameState,
  playerName: string,
  endReason: RunnerRoundEndReason
): {
  result: ReturnType<typeof calculateRunnerRoundEconomyResult>
  finalCard: EducationalCard | null
  rankingEntry: RunnerRankingEntry
  summary: RunnerRoundSummary
} {
  const roundConfig = gameState.roundProgress.currentRoundConfig

  const result = calculateRunnerRoundEconomyResult(
    {
      roundNumber: gameState.roundProgress.currentRound,
      targetQualifiedCollects: gameState.stats.minCollectibles,
      baseRoundDurationSeconds: roundConfig.durationSeconds,
      timeRemainingSeconds: gameState.stats.timeLeft,
      distanceTravelled: gameState.stats.distance,
      qualifiedCollects: gameState.stats.qualifiedCollects,
      coinsCollected: gameState.stats.coins,
      ecoScore: gameState.stats.ecoScore,
      collisionsTaken: gameState.stats.collisionsTaken,
      shieldUses: gameState.stats.shieldUses,
      shieldBlocks: gameState.stats.shieldBlocks,
      livesRemaining: gameState.stats.lives
    },
    roundConfig
  )

  const finalCard = pickEducationalCard({
    roundNumber: gameState.roundProgress.currentRound,
    completionStatus: result.completionStatus
  })

  const rankingEntry: RunnerRankingEntry = {
    playerName,
    roundNumber: gameState.roundProgress.currentRound,
    vehicleId: gameState.player.vehicleId,
    completionStatus: result.completionStatus,
    timeSpentSeconds: result.timeSpentSeconds,
    timeRemainingSeconds: Math.max(0, Math.floor(gameState.stats.timeLeft)),
    distanceTravelled: Math.floor(gameState.stats.distance),
    qualifiedCollects: gameState.stats.qualifiedCollects,
    coinsCollected: result.coinsEarned,
    ecoScore: gameState.stats.ecoScore,
    carbonCreditsEarned: result.carbonCreditsEarned,
    collisionsTaken: gameState.stats.collisionsTaken,
    shieldUses: gameState.stats.shieldUses,
    shieldBlocks: gameState.stats.shieldBlocks,
    scoreFinal: result.scoreFinal,
    playedAt: new Date().toISOString()
  }

  const summary: RunnerRoundSummary = {
    completionStatus: result.completionStatus,
    endReason,
    scoreFinal: result.scoreFinal,
    coinsEarned: result.coinsEarned,
    carbonCreditsEarned: result.carbonCreditsEarned,
    missedTargetAmount: result.missedTargetAmount,
    timeSpentSeconds: result.timeSpentSeconds,
    analytics: {
      timeToFirstCollectSeconds:
        gameState.telemetry.firstCollectAtMs === null
          ? null
          : Number((gameState.telemetry.firstCollectAtMs / 1000).toFixed(1)),
      timeToFirstCollisionSeconds:
        gameState.telemetry.firstCollisionAtMs === null
          ? null
          : Number((gameState.telemetry.firstCollisionAtMs / 1000).toFixed(1)),
      collisionsByLane: { ...gameState.telemetry.collisionsByLane },
      gameOverReason: result.completionStatus === 'victory' ? 'victory' : endReason
    },
    newlyUnlockedVehicleIds: [],
    nextRoundUnlocked: false,
    canAdvanceToNextRound: false
  }

  return {
    result,
    finalCard,
    rankingEntry,
    summary
  }
}
