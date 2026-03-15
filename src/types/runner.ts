export type RunnerStatus = 'idle' | 'running' | 'paused' | 'victory' | 'gameover'

export type LaneIndex = 0 | 1 | 2

export type RunnerEntityType = 'obstacle' | 'collectible'

export interface RunnerPlayerState {
  lane: LaneIndex
  isJumping: boolean
  jumpProgress: number
  vehicleLevel: number
  isInvulnerable?: boolean
  turboActive?: boolean
  turboCharge?: number
  turboTimeLeft?: number
}

export interface RunnerStats {
  score: number
  coins: number
  lives: number
  distance: number
  targetDistance: number
  speed: number
  timeLeft: number
  minCollectibles: number
  collectedCount: number
  phaseLevel: number
}

export interface RunnerEntity {
  id: string
  type: RunnerEntityType
  lane: LaneIndex
  depth: number
  emoji: string
  active: boolean
}

export interface RunnerGameState {
  status: RunnerStatus
  player: RunnerPlayerState
  stats: RunnerStats
  entities: RunnerEntity[]
  roadMarkers?: RunnerRoadMarker[]}

export interface RunnerRoadMarker {
  id: string
  depth: number
}