export type EcoNaveStageId =
  | 'earth_orbit'
  | 'debris_belt'
  | 'satellite_corridor'
  | 'microplastic_storm'
  | 'junk_boss'

export type EcoNaveShipId = 'aurora_seed' | 'solar_wing' | 'gaia_guard'

export type EcoNaveGameStatus =
  | 'menu'
  | 'countdown'
  | 'running'
  | 'paused'
  | 'victory'
  | 'defeat'

export type EcoNaveEntityKind =
  | 'recyclable'
  | 'hazard'
  | 'satellite'
  | 'obstacle'
  | 'powerup'
  | 'bonus'
  | 'boss'

export type EcoNaveInteractionMode = 'collect' | 'neutralize' | 'avoid' | 'protect'

export type EcoNavePowerUpType =
  | 'shield'
  | 'magnet'
  | 'cleanup_pulse'
  | 'classifier'
  | 'turbo'
  | 'time_slow'

export type EcoNaveMusicTrack = 'orbital' | 'storm' | 'boss'
export type EcoNaveAudioCue =
  | 'fire'
  | 'collect'
  | 'error'
  | 'damage'
  | 'powerup'
  | 'alert'
  | 'victory'
  | 'defeat'
  | 'pulse'
  | 'boss'

export type EcoNaveRenderQuality = 'high' | 'balanced' | 'eco'
export type EcoNaveFeedbackTone = 'positive' | 'warning' | 'negative' | 'mission'

export interface EcoNaveEducationalCard {
  title: string
  fact: string
  tip: string
  summary: string
}

export interface EcoNaveStageGoals {
  collectTarget: number
  neutralizeTarget: number
  protectTarget: number
  ecoScoreTarget: number
  bossDefeatRequired?: boolean
}

export interface EcoNaveStageSpawnConfig {
  entityIntervalMs: [number, number]
  powerUpIntervalMs: [number, number]
  bonusIntervalMs: [number, number]
  maxEntities: number
  categoryWeights: Record<'recyclable' | 'hazard' | 'satellite' | 'obstacle', number>
  blueprintIds: string[]
}

export interface EcoNaveBossConfig {
  blueprintId: string
  hitPoints: number
  spawnAtSeconds: number
  minionBlueprintIds: string[]
  minionIntervalMs: number
}

export interface EcoNaveStageConfig {
  id: EcoNaveStageId
  order: number
  title: string
  badge: string
  themeName: string
  description: string
  gradient: string
  accentColor: string
  skyTop: number
  skyBottom: number
  soundtrack: EcoNaveMusicTrack
  durationSeconds: number
  baseScrollSpeed: number
  missionLines: string[]
  goals: EcoNaveStageGoals
  spawn: EcoNaveStageSpawnConfig
  educationalCard: EcoNaveEducationalCard
  boss?: EcoNaveBossConfig
}

export interface EcoNaveShipStats {
  moveSpeed: number
  fireCooldownMs: number
  maxEnergy: number
  magnetRadius: number
  pulseRadius: number
  startingPulseCharges: number
}

export interface EcoNaveShipConfig {
  id: EcoNaveShipId
  name: string
  emoji: string
  unlockCredits: number
  description: string
  accentColor: string
  gradient: string
  stats: EcoNaveShipStats
  educationalBenefit: string
}

export interface EcoNaveEntityBlueprint {
  id: string
  label: string
  emoji: string
  kind: EcoNaveEntityKind
  handling: EcoNaveInteractionMode
  color: number
  radius: number
  spawnWeight: number
  scoreValue: number
  ecoValue: number
  creditValue: number
  damage: number
  hitPoints?: number
  powerUpType?: EcoNavePowerUpType
}

export interface EcoNaveStageProgress {
  stageId: EcoNaveStageId
  unlocked: boolean
  attempts: number
  completions: number
  bestScore: number
  bestStars: number
  bestEcoScore: number
  highCombo: number
  lastPlayedAt: string | null
  completedAt: string | null
}

export interface EcoNavePreferences {
  muted: boolean
  musicMuted: boolean
  sfxVolume: number
  musicVolume: number
  quality: EcoNaveRenderQuality
}

export interface EcoNavePersistentProgress {
  version: number
  ecoCredits: number
  totalStars: number
  highestUnlockedStage: number
  selectedShipId: EcoNaveShipId
  unlockedShipIds: EcoNaveShipId[]
  achievements: string[]
  settings: EcoNavePreferences
  stages: Record<EcoNaveStageId, EcoNaveStageProgress>
}

export interface EcoNaveEffectsState {
  magnetMs: number
  classifierMs: number
  turboMs: number
  slowMs: number
}

export interface EcoNavePlayerState {
  x: number
  y: number
  radius: number
  energy: number
  maxEnergy: number
  shieldHits: number
  pulseCharges: number
  fireCooldownMs: number
  moveSpeed: number
  magnetRadius: number
  pulseRadius: number
  effects: EcoNaveEffectsState
}

export interface EcoNaveMissionState {
  collectTarget: number
  neutralizeTarget: number
  protectTarget: number
  ecoScoreTarget: number
  collectedCorrect: number
  neutralizedHazards: number
  protectedSatellites: number
  satellitesLost: number
  ecoScore: number
}

export interface EcoNaveEntity {
  id: string
  blueprintId: string
  kind: EcoNaveEntityKind
  handling: EcoNaveInteractionMode
  emoji: string
  color: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  hp: number
  maxHp: number
  damage: number
  scoreValue: number
  ecoValue: number
  creditValue: number
  powerUpType: EcoNavePowerUpType | null
  active: boolean
  angle: number
  angularVelocity: number
}

export interface EcoNaveProjectile {
  id: string
  x: number
  y: number
  vy: number
  radius: number
  ttlMs: number
  active: boolean
}

export interface EcoNaveParticle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  ttlMs: number
  maxTtlMs: number
  size: number
  color: number
  alpha: number
}

export interface EcoNaveRuntimeFeedback {
  id: string
  tone: EcoNaveFeedbackTone
  text: string
  icon: string
  cue: EcoNaveAudioCue
}

export interface EcoNaveRuntimeEvent {
  kind: 'feedback' | 'result'
  feedback?: EcoNaveRuntimeFeedback
  result?: EcoNaveStageResult
}

export interface EcoNaveRuntimeState {
  status: EcoNaveGameStatus
  stageId: EcoNaveStageId
  stageConfig: EcoNaveStageConfig
  shipConfig: EcoNaveShipConfig
  elapsedMs: number
  timeLeftMs: number
  score: number
  combo: number
  comboBest: number
  creditsCollected: number
  player: EcoNavePlayerState
  mission: EcoNaveMissionState
  entities: EcoNaveEntity[]
  projectiles: EcoNaveProjectile[]
  particles: EcoNaveParticle[]
  backgroundOffset: number
  cameraShakeMs: number
  nextEntitySpawnMs: number
  nextPowerUpSpawnMs: number
  nextBonusSpawnMs: number
  nextBossMinionSpawnMs: number
  bossSpawned: boolean
  bossDefeated: boolean
  bossHp: number
  bossMaxHp: number
  stageWarningIssued: boolean
  lastFeedback: EcoNaveRuntimeFeedback | null
  nextId: number
}

export interface EcoNaveInputState {
  moveX: number
  moveY: number
  firePressed: boolean
}

export interface EcoNaveRulesResult {
  positive: boolean
  removeEntity: boolean
  projectileConsumed: boolean
  playerDamage: number
  shieldBlocked: boolean
  scoreDelta: number
  ecoDelta: number
  creditDelta: number
  collectDelta: number
  neutralizeDelta: number
  protectedDelta: number
  lostSatelliteDelta: number
  bossDamage: number
  powerUpGranted: EcoNavePowerUpType | null
  feedback: {
    tone: EcoNaveFeedbackTone
    text: string
    icon: string
    cue: EcoNaveAudioCue
  }
}

export interface EcoNaveStageResult {
  stageId: EcoNaveStageId
  victory: boolean
  score: number
  starsEarned: number
  ecoCreditsEarned: number
  ecoScore: number
  collectedCorrect: number
  neutralizedHazards: number
  protectedSatellites: number
  satellitesLost: number
  comboBest: number
  bossDefeated: boolean
  nextStageUnlocked: boolean
  newlyUnlockedShipIds: EcoNaveShipId[]
  educationalCard: EcoNaveEducationalCard
  summaryLines: string[]
  completedAt: string
}

export interface EcoNaveProgressApplyResult {
  progress: EcoNavePersistentProgress
  nextStageUnlocked: boolean
  newlyUnlockedShipIds: EcoNaveShipId[]
  newlyUnlockedAchievements: string[]
}

export interface EcoNaveHudSnapshot {
  status: EcoNaveGameStatus
  score: number
  combo: number
  energy: number
  maxEnergy: number
  pulseCharges: number
  timeLeftSeconds: number
  collectedCorrect: number
  collectTarget: number
  neutralizedHazards: number
  neutralizeTarget: number
  protectedSatellites: number
  protectTarget: number
  ecoScore: number
  ecoScoreTarget: number
  bossHp: number
  bossMaxHp: number
  activeEffects: EcoNaveEffectsState
}
