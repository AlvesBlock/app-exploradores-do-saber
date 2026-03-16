export type RunnerCardType = 'victory' | 'defeat'
export type RunnerCollectibleClass = 'good' | 'bad' | 'risky' | 'special'
export type RunnerObstacleSeverity = 'minor' | 'major'
export type RunnerRoundEndReason =
  | 'victory'
  | 'time_up'
  | 'lives_depleted'
  | 'missed_target'
export type RunnerFeedbackTone = 'positive' | 'warning' | 'negative' | 'neutral'

export type WasteCategory =
  | 'paper'
  | 'plastic'
  | 'metal'
  | 'glass'
  | 'hazardous'
  | 'electronic'
  | 'organic'

export type WasteRarity = 'common' | 'uncommon' | 'rare' | 'epic'

export interface RunnerRoundConfig {
  round: number
  title: string
  background: string
  durationSeconds: number
  targetQualifiedCollects: number
  baseSpeed: number
  maxSpeed: number
  obstacleRate: number
  tutorialWindowSeconds: number
  collectibleIntervalMs: number
  obstacleIntervalMs: number
  laneCooldownMs: number
  safeLaneWindowMs: number
  maxVisibleEntities: number
  rareWasteChance: number
  pollutionPenaltyMultiplier: number
  victoryCoins: number
  victoryCarbonCredits: number
  emergencyHealCost: number
  shieldChargeNeeded: number
  notes: string
}

export interface RunnerWasteType {
  id: string
  name: string
  category: WasteCategory
  emoji: string
  rarity: WasteRarity
  collectibleClass: RunnerCollectibleClass
  coinValue: number
  ecoScoreValue: number
  carbonCreditValue: number
  shieldChargeGain: number
  wrongHandlingPenalty: number
  spawnWeight: number
  requiresShieldForQualified?: boolean
  educationalTag: string
  feedbackText: string
}

export interface RunnerObstacleConfig {
  id: string
  name: string
  emoji: string
  severity: RunnerObstacleSeverity
  spawnWeight: number
  scorePenalty: number
  feedbackText: string
}

export interface VehicleBenefits {
  laneSwitchSpeed: number
  shieldChargeBonus: number
  coinBonusPercent: number
  ecoScoreBonusPercent: number
  collisionProtection: number
}

export interface RunnerVehicle {
  id: string
  name: string
  emoji: string
  unlockCoins: number
  unlockCarbonCredits: number
  tier: number
  description: string
  benefits: VehicleBenefits
  educationalBenefit: string
  flavorText: string
}

export interface EducationalCard {
  id: string
  type: RunnerCardType
  title: string
  subtitle: string
  message: string
  fact: string
  tip: string
  category: string
  icon: string
  minRound: number
  maxRound: number
  tags: string[]
}

export interface EducationalCardsCollection {
  cards: {
    victoryCards: EducationalCard[]
    defeatCards: EducationalCard[]
  }
}

export type RunnerCompletionStatus = 'victory' | 'defeat'

export interface RunnerRankingEntry {
  playerName: string
  roundNumber: number
  vehicleId: string
  completionStatus: RunnerCompletionStatus
  timeSpentSeconds: number
  timeRemainingSeconds: number
  distanceTravelled: number
  qualifiedCollects: number
  coinsCollected: number
  ecoScore: number
  carbonCreditsEarned: number
  collisionsTaken: number
  shieldUses: number
  shieldBlocks: number
  scoreFinal: number
  playedAt: string
}

export interface RunnerRoundPerformanceInput {
  roundNumber: number
  targetQualifiedCollects: number
  baseRoundDurationSeconds: number
  timeRemainingSeconds: number
  distanceTravelled: number
  qualifiedCollects: number
  coinsCollected: number
  ecoScore: number
  collisionsTaken: number
  shieldUses: number
  shieldBlocks: number
  livesRemaining: number
}

export interface RunnerRoundEconomyResult {
  completionStatus: RunnerCompletionStatus
  scoreFinal: number
  carbonCreditsEarned: number
  coinsEarned: number
  missedTargetAmount: number
  timeSpentSeconds: number
  victoryAchieved: boolean
}

export interface RunnerFeedbackEvent {
  kind: 'collect' | 'warning' | 'hit' | 'block' | 'shield' | 'heal' | 'round'
  tone: RunnerFeedbackTone
  text: string
  icon?: string
}

export interface RunnerRoundAnalytics {
  timeToFirstCollectSeconds: number | null
  timeToFirstCollisionSeconds: number | null
  collisionsByLane: Record<0 | 1 | 2, number>
  gameOverReason: RunnerRoundEndReason | null
}

export interface RunnerRoundSummary {
  completionStatus: RunnerCompletionStatus
  endReason: RunnerRoundEndReason
  scoreFinal: number
  coinsEarned: number
  carbonCreditsEarned: number
  missedTargetAmount: number
  timeSpentSeconds: number
  analytics: RunnerRoundAnalytics
  newlyUnlockedVehicleIds: string[]
  nextRoundUnlocked: boolean
  canAdvanceToNextRound: boolean
}

export interface EmergencyHealCheckInput {
  currentLives: number
  currentCoins: number
  healCost: number
  timeRemainingSeconds: number
  roundDurationSeconds: number
  alreadyUsedEmergencyHeal: boolean
}

export interface EmergencyHealCheckResult {
  allowed: boolean
  reason:
    | 'ok'
    | 'not_last_life'
    | 'not_in_final_window'
    | 'already_used'
    | 'insufficient_coins'
}

export interface EducationalCardPickInput {
  roundNumber: number
  completionStatus: RunnerCompletionStatus
}

export interface RunnerPersistentProgress {
  totalCoins: number
  totalCarbonCredits: number
  selectedVehicleId: string
  unlockedVehicleIds: string[]
  highestUnlockedRound: number
  rankings: RunnerRankingEntry[]
}
