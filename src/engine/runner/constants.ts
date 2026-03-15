import type { RunnerGameState } from '@/types/runner'


function createInitialRoadMarkers() {
  return Array.from({ length: 9 }, (_, index) => ({
    id: `marker-${index + 1}`,
    depth: index / 9
  }))
}

export const RUNNER_DEFAULT_STATE: RunnerGameState = {
  status: 'idle',
  player: {
    lane: 1,
    isJumping: false,
    jumpProgress: 0,
    vehicleLevel: 0,
    isInvulnerable: false,
    turboActive: false,
    turboCharge: 0,
    turboTimeLeft: 0    
  },
  stats: {
    score: 0,
    coins: 0,
    lives: 3,
    distance: 0,
    targetDistance: 3000,
    speed: 0.85,
    timeLeft: 75,
    minCollectibles: 10,
    collectedCount: 0,
    phaseLevel: 1
  },
  entities: [],
  roadMarkers: createInitialRoadMarkers(),
}

export const RUNNER_LANES = [0, 1, 2] as const

export const RUNNER_OBSTACLES = [
  '🚧',
  '📦',
  '🕳️',
  '🐌',
  '🛑'
] as const

export const RUNNER_COLLECTIBLES = [
  '🧴',
  '🥫',
  '📰',
  '📦',
  '🍾'
] as const

export const VEHICLE_STAGES = ['🛹', '🚲', '🛵', '🚗', '🏎️', '🚀'] as const

export const VEHICLE_UPGRADE_COSTS = [0, 5, 10, 18, 28, 40] as const