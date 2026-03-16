import {
  createCollectibleEntity,
  createObstacleEntity,
  pickWasteForRound
} from '@/engine/runner/entities'
import { RUNNER_WASTE_TYPES } from '@/engine/runner/data/wasteTypes'
import type { RunnerRoundConfig } from '@/types/runner-game'
import type {
  LaneIndex,
  RunnerEntity,
  RunnerGameState,
  RunnerPhaseLevel
} from '@/types/runner-state'
import type { RunnerDifficultySnapshot } from './difficulty'

type RandomFn = () => number

export interface RunnerSpawnRuntime {
  collectibleTimer: number
  obstacleTimer: number
  laneCooldownMs: Record<LaneIndex, number>
  lastObstacleSpawnAtMs: number
}

const EARLY_GOOD_COLLECTIBLES = RUNNER_WASTE_TYPES.filter(
  (waste) => waste.collectibleClass === 'good' && waste.rarity === 'common'
)

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function chooseRandomLane(lanes: LaneIndex[], randomFn: RandomFn): LaneIndex | null {
  if (lanes.length === 0) {
    return null
  }

  const lane = lanes[Math.floor(randomFn() * lanes.length)]
  return lane ?? null
}

function reduceLaneCooldowns(runtime: RunnerSpawnRuntime, deltaMs: number) {
  ;([0, 1, 2] as LaneIndex[]).forEach((lane) => {
    runtime.laneCooldownMs[lane] = Math.max(0, runtime.laneCooldownMs[lane] - deltaMs)
  })
}

function getThreatenedLanes(gameState: RunnerGameState): Set<LaneIndex> {
  return new Set(
    gameState.entities
      .filter(
        (entity) =>
          entity.active &&
          entity.type === 'obstacle' &&
          entity.depth >= 0.15 &&
          entity.depth <= 0.74
      )
      .map((entity) => entity.lane)
  )
}

function getLaneOccupancy(gameState: RunnerGameState, lane: LaneIndex): number {
  return gameState.entities.filter(
    (entity) => entity.active && entity.lane === lane && entity.depth <= 0.45
  ).length
}

function isLaneOpenForSpawn(
  gameState: RunnerGameState,
  lane: LaneIndex,
  maxDepth = 0.24
): boolean {
  return !gameState.entities.some(
    (entity) => entity.active && entity.lane === lane && entity.depth <= maxDepth
  )
}

function getAvailableLanes(
  gameState: RunnerGameState,
  runtime: RunnerSpawnRuntime,
  roundConfig: RunnerRoundConfig
): LaneIndex[] {
  return ([0, 1, 2] as LaneIndex[]).filter((lane) => {
    return (
      runtime.laneCooldownMs[lane] <= 0 &&
      isLaneOpenForSpawn(gameState, lane) &&
      getLaneOccupancy(gameState, lane) < 2 &&
      roundConfig.maxVisibleEntities > gameState.entities.length
    )
  })
}

function chooseCollectibleLane(
  gameState: RunnerGameState,
  runtime: RunnerSpawnRuntime,
  roundConfig: RunnerRoundConfig,
  randomFn: RandomFn
): LaneIndex | null {
  const availableLanes = getAvailableLanes(gameState, runtime, roundConfig)

  if (availableLanes.length === 0) {
    return null
  }

  const sorted = [...availableLanes].sort(
    (laneA, laneB) => getLaneOccupancy(gameState, laneA) - getLaneOccupancy(gameState, laneB)
  )
  const bestOccupancy = getLaneOccupancy(gameState, sorted[0]!)
  const preferred = sorted.filter((lane) => getLaneOccupancy(gameState, lane) === bestOccupancy)
  return chooseRandomLane(preferred, randomFn)
}

function chooseObstacleLane(
  gameState: RunnerGameState,
  runtime: RunnerSpawnRuntime,
  roundConfig: RunnerRoundConfig,
  randomFn: RandomFn
): LaneIndex | null {
  const threatenedLanes = getThreatenedLanes(gameState)
  const availableLanes = getAvailableLanes(gameState, runtime, roundConfig)

  if (availableLanes.length === 0) {
    return null
  }

  if (threatenedLanes.size >= 2) {
    return null
  }

  const safeCandidates = availableLanes.filter((lane) => !threatenedLanes.has(lane))

  if (safeCandidates.length > 0) {
    return chooseRandomLane(safeCandidates, randomFn)
  }

  return chooseRandomLane(availableLanes, randomFn)
}

function pickTutorialWaste(
  roundConfig: RunnerRoundConfig,
  phaseLevel: RunnerPhaseLevel,
  randomFn: RandomFn
): RunnerEntity {
  const waste = EARLY_GOOD_COLLECTIBLES[Math.floor(randomFn() * EARLY_GOOD_COLLECTIBLES.length)]
  return createCollectibleEntity(roundConfig, phaseLevel, {
    waste
  })
}

export function createRunnerSpawnRuntime(): RunnerSpawnRuntime {
  return {
    collectibleTimer: 0,
    obstacleTimer: 0,
    laneCooldownMs: {
      0: 0,
      1: 0,
      2: 0
    },
    lastObstacleSpawnAtMs: -Infinity
  }
}

export function resetRunnerSpawnRuntime(runtime: RunnerSpawnRuntime): void {
  runtime.collectibleTimer = 0
  runtime.obstacleTimer = 0
  runtime.lastObstacleSpawnAtMs = -Infinity
  runtime.laneCooldownMs[0] = 0
  runtime.laneCooldownMs[1] = 0
  runtime.laneCooldownMs[2] = 0
}

export function updateRunnerSpawnRuntime(
  gameState: RunnerGameState,
  runtime: RunnerSpawnRuntime,
  snapshot: RunnerDifficultySnapshot,
  deltaMs: number,
  randomFn: RandomFn = Math.random
): RunnerEntity[] {
  const { currentRoundConfig } = gameState.roundProgress
  const spawnedEntities: RunnerEntity[] = []
  const isTutorialWindow =
    gameState.telemetry.elapsedMs < currentRoundConfig.tutorialWindowSeconds * 1000

  reduceLaneCooldowns(runtime, deltaMs)
  runtime.collectibleTimer += deltaMs
  runtime.obstacleTimer += deltaMs

  if (
    runtime.collectibleTimer >= snapshot.collectibleIntervalMs &&
    gameState.entities.length < currentRoundConfig.maxVisibleEntities
  ) {
    const lane = chooseCollectibleLane(gameState, runtime, currentRoundConfig, randomFn)

    if (lane !== null) {
      const collectible = isTutorialWindow
        ? pickTutorialWaste(currentRoundConfig, snapshot.phaseLevel, randomFn)
        : createCollectibleEntity(currentRoundConfig, snapshot.phaseLevel, {
            lane,
            waste: pickWasteForRound(currentRoundConfig, snapshot.phaseLevel, randomFn),
            randomFn
          })

      collectible.lane = lane
      gameState.entities.push(collectible)
      spawnedEntities.push(collectible)
      runtime.collectibleTimer = clamp(
        runtime.collectibleTimer - snapshot.collectibleIntervalMs,
        0,
        snapshot.collectibleIntervalMs
      )
    }
  }

  const safeWindowOpen =
    gameState.telemetry.elapsedMs - runtime.lastObstacleSpawnAtMs >= currentRoundConfig.safeLaneWindowMs

  if (
    !isTutorialWindow &&
    safeWindowOpen &&
    runtime.obstacleTimer >= snapshot.obstacleIntervalMs &&
    gameState.entities.length < currentRoundConfig.maxVisibleEntities
  ) {
    const lane = chooseObstacleLane(gameState, runtime, currentRoundConfig, randomFn)

    if (lane !== null) {
      const obstacle = createObstacleEntity({
        lane,
        randomFn
      })

      gameState.entities.push(obstacle)
      spawnedEntities.push(obstacle)
      runtime.laneCooldownMs[lane] = currentRoundConfig.laneCooldownMs
      runtime.lastObstacleSpawnAtMs = gameState.telemetry.elapsedMs
      runtime.obstacleTimer = clamp(
        runtime.obstacleTimer - snapshot.obstacleIntervalMs,
        0,
        snapshot.obstacleIntervalMs
      )
    }
  }

  return spawnedEntities
}
