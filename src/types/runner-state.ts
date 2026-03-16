import type {
  EducationalCard,
  RunnerCollectibleClass,
  RunnerCompletionStatus,
  RunnerFeedbackEvent,
  RunnerObstacleSeverity,
  RunnerRankingEntry,
  RunnerRoundEndReason,
  RunnerRoundConfig,
  RunnerRoundSummary
} from '@/types/runner-game'

export type RunnerGameStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'victory'
  | 'gameover'

export type LaneIndex = 0 | 1 | 2

export type RunnerEntityType = 'collectible' | 'obstacle'

export type RunnerPhaseLevel = 1 | 2 | 3

export interface RunnerEntity {
  /**
   * Uses string IDs for runtime generation and future persistence.
   */
  id: string
  type: RunnerEntityType
  lane: LaneIndex
  depth: number
  emoji: string
  active: boolean
  label?: string

  /**
   * Identifies the domain object represented by the entity.
   */
  kindId?: string

  /**
   * Marks whether the collectible counts toward the qualified target.
   */
  isQualifiedCollect?: boolean

  /**
   * Spawn-resolved payload to avoid repeated lookups during the frame loop.
   */
  coinValue?: number
  ecoScoreValue?: number
  carbonCreditValue?: number
  shieldChargeGain?: number
  wrongHandlingPenalty?: number
  feedbackText?: string
  collectibleClass?: RunnerCollectibleClass
  requiresShieldForQualified?: boolean
  obstacleSeverity?: RunnerObstacleSeverity
  scorePenalty?: number
}

export interface RunnerRoadMarker {
  id: string
  depth: number
}

export interface RunnerPlayerState {
  lane: LaneIndex
  vehicleLevel: number
  vehicleId: string

  /**
   * Shield is the canonical defensive mechanic in place of the old turbo model.
   */
  shieldCharge: number
  shieldChargeNeeded: number
  shieldActive: boolean

  /**
   * Remaining active shield time in seconds. Uses `0` while inactive.
   */
  shieldTimeLeft: number

  /**
   * Tracks one-time emergency heal usage for the current round.
   */
  emergencyHealUsed: boolean
}

export interface RunnerStatsState {
  score: number
  coins: number
  lives: number
  distance: number
  speed: number
  timeLeft: number
  elapsedSeconds: number

  /**
   * Round goals.
   */
  targetDistance: number
  minCollectibles: number

  /**
   * Collection and sustainability metrics.
   */
  collectedCount: number
  qualifiedCollects: number
  invalidCollects: number
  riskyCollects: number
  specialCollects: number
  ecoScore: number
  carbonCredits: number

  /**
   * Round outcome metrics.
   */
  collisionsTaken: number
  shieldUses: number
  shieldBlocks: number
  phaseLevel: RunnerPhaseLevel
}

export interface RunnerRoundProgressState {
  currentRound: number
  currentRoundConfig: RunnerRoundConfig
  roundCompleted: boolean
  completionStatus: RunnerCompletionStatus | null
  endReason: RunnerRoundEndReason | null
  finalCard: EducationalCard | null
  finalRankingEntry: RunnerRankingEntry | null
  finalSummaryText: string | null
  finalResult: RunnerRoundSummary | null
}

export interface RunnerMetaState {
  selectedVehicleId: string
  unlockedVehicleIds: string[]
  walletCoins: number
  walletCarbonCredits: number
  highestUnlockedRound: number
}

export interface RunnerTelemetryState {
  elapsedMs: number
  firstCollectAtMs: number | null
  firstCollisionAtMs: number | null
  collisionsByLane: Record<LaneIndex, number>
}

export interface RunnerUiState {
  lastFeedback: RunnerFeedbackEvent | null
}

export interface RunnerGameState {
  status: RunnerGameStatus
  player: RunnerPlayerState
  stats: RunnerStatsState
  entities: RunnerEntity[]
  roadMarkers: RunnerRoadMarker[]
  roundProgress: RunnerRoundProgressState
  meta: RunnerMetaState
  telemetry: RunnerTelemetryState
  ui: RunnerUiState
}
