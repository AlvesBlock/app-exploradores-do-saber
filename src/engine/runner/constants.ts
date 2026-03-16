import type { RunnerGameState, RunnerRoadMarker } from '@/types/runner-state'
import { getRunnerRoundConfig } from './data/rounds'

const INITIAL_ROUND_CONFIG = getRunnerRoundConfig(1)

export function createInitialRoadMarkers(): RunnerRoadMarker[] {
  return Array.from({ length: 9 }, (_, index) => ({
    id: `marker-${index + 1}`,
    depth: index / 9
  }))
}

export const RUNNER_DEFAULT_STATE: RunnerGameState = {
  status: 'idle',
  player: {
    lane: 1,
    vehicleLevel: 0,
    vehicleId: 'recycled_skate',
    shieldCharge: 0,
    shieldChargeNeeded: INITIAL_ROUND_CONFIG.shieldChargeNeeded,
    shieldActive: false,
    shieldTimeLeft: 0,
    emergencyHealUsed: false
  },
  stats: {
    score: 0,
    coins: 0,
    lives: 3,
    distance: 0,
    speed: INITIAL_ROUND_CONFIG.baseSpeed,
    timeLeft: INITIAL_ROUND_CONFIG.durationSeconds,
    elapsedSeconds: 0,
    targetDistance: INITIAL_ROUND_CONFIG.durationSeconds * 12,
    minCollectibles: INITIAL_ROUND_CONFIG.targetQualifiedCollects,
    collectedCount: 0,
    qualifiedCollects: 0,
    invalidCollects: 0,
    riskyCollects: 0,
    specialCollects: 0,
    ecoScore: 0,
    carbonCredits: 0,
    collisionsTaken: 0,
    shieldUses: 0,
    shieldBlocks: 0,
    phaseLevel: 1
  },
  entities: [],
  roadMarkers: createInitialRoadMarkers(),
  roundProgress: {
    currentRound: 1,
    currentRoundConfig: INITIAL_ROUND_CONFIG,
    roundCompleted: false,
    completionStatus: null,
    endReason: null,
    finalCard: null,
    finalRankingEntry: null,
    finalSummaryText: null,
    finalResult: null
  },
  meta: {
    selectedVehicleId: 'recycled_skate',
    unlockedVehicleIds: ['recycled_skate'],
    walletCoins: 0,
    walletCarbonCredits: 0,
    highestUnlockedRound: 1
  },
  telemetry: {
    elapsedMs: 0,
    firstCollectAtMs: null,
    firstCollisionAtMs: null,
    collisionsByLane: {
      0: 0,
      1: 0,
      2: 0
    }
  },
  ui: {
    lastFeedback: null
  }
}

export const RUNNER_LANES = [0, 1, 2] as const
