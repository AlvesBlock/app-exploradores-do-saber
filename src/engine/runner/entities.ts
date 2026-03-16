import { RUNNER_LANES } from '@/engine/runner/constants'
import { RUNNER_OBSTACLES } from '@/engine/runner/data/obstacles'
import { RUNNER_WASTE_TYPES } from '@/engine/runner/data/wasteTypes'
import type {
  RunnerObstacleConfig,
  RunnerRoundConfig,
  RunnerWasteType,
  WasteRarity
} from '@/types/runner-game'
import type { LaneIndex, RunnerEntity, RunnerPhaseLevel } from '@/types/runner-state'

type RandomFn = () => number

const WASTE_RARITY_ORDER: WasteRarity[] = ['common', 'uncommon', 'rare', 'epic']

function randomFromArray<T>(items: readonly T[], randomFn: RandomFn): T {
  const item = items[Math.floor(randomFn() * items.length)]

  if (item === undefined) {
    throw new Error('Tentativa de selecionar item em um array vazio.')
  }

  return item
}

function randomId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function weightedRandom<T extends { spawnWeight: number }>(
  items: readonly T[],
  randomFn: RandomFn
): T {
  if (items.length === 0) {
    throw new Error('weightedRandom requires a non-empty array')
  }

  const totalWeight = items.reduce((sum, item) => sum + item.spawnWeight, 0)
  let random = randomFn() * totalWeight

  for (const item of items) {
    random -= item.spawnWeight
    if (random <= 0) {
      return item
    }
  }

  return items[items.length - 1]!
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function getMaxRarityIndex(roundNumber: number, phaseLevel: RunnerPhaseLevel): number {
  const baseIndex =
    roundNumber >= 9 ? 3 :
      roundNumber >= 6 ? 2 :
        roundNumber >= 3 ? 1 :
          0

  const phaseBonus = phaseLevel === 3 ? 1 : 0
  return Math.min(WASTE_RARITY_ORDER.length - 1, baseIndex + phaseBonus)
}

export function pickWasteForRound(
  roundConfig: RunnerRoundConfig,
  phaseLevel: RunnerPhaseLevel,
  randomFn: RandomFn = Math.random
): RunnerWasteType {
  const maxRarityIndex = getMaxRarityIndex(roundConfig.round, phaseLevel)
  const allowedRarities = new Set(WASTE_RARITY_ORDER.slice(0, maxRarityIndex + 1))
  const eligibleWaste = RUNNER_WASTE_TYPES.filter((waste) => allowedRarities.has(waste.rarity))

  if (eligibleWaste.length === 0) {
    return weightedRandom(RUNNER_WASTE_TYPES, randomFn)
  }

  const elevatedWaste = eligibleWaste.filter((waste) => waste.rarity !== 'common')
  const rareChanceBoost = phaseLevel === 3 ? 0.07 : phaseLevel === 2 ? 0.03 : 0
  const elevatedChance = clamp(roundConfig.rareWasteChance + rareChanceBoost, 0, 0.45)

  if (elevatedWaste.length > 0 && randomFn() < elevatedChance) {
    return weightedRandom(elevatedWaste, randomFn)
  }

  return weightedRandom(eligibleWaste, randomFn)
}

export function pickObstacleForRound(randomFn: RandomFn = Math.random): RunnerObstacleConfig {
  return weightedRandom(RUNNER_OBSTACLES, randomFn)
}

export function createObstacleEntity(options: {
  lane?: LaneIndex
  obstacle?: RunnerObstacleConfig
  randomFn?: RandomFn
} = {}): RunnerEntity {
  const randomFn = options.randomFn ?? Math.random
  const obstacle = options.obstacle ?? pickObstacleForRound(randomFn)

  return {
    id: randomId(),
    type: 'obstacle',
    lane: options.lane ?? (randomFromArray(RUNNER_LANES, randomFn) as LaneIndex),
    depth: 0,
    emoji: obstacle.emoji,
    label: obstacle.name,
    active: true,
    kindId: obstacle.id,
    feedbackText: obstacle.feedbackText,
    obstacleSeverity: obstacle.severity,
    scorePenalty: obstacle.scorePenalty
  }
}

export function createCollectibleEntity(
  roundConfig: RunnerRoundConfig,
  phaseLevel: RunnerPhaseLevel,
  options: {
    lane?: LaneIndex
    waste?: RunnerWasteType
    randomFn?: RandomFn
  } = {}
): RunnerEntity {
  const randomFn = options.randomFn ?? Math.random
  const waste = options.waste ?? pickWasteForRound(roundConfig, phaseLevel, randomFn)
  const isQualifiedCollect = waste.collectibleClass === 'good' || waste.collectibleClass === 'special'

  return {
    id: randomId(),
    type: 'collectible',
    lane: options.lane ?? (randomFromArray(RUNNER_LANES, randomFn) as LaneIndex),
    depth: 0,
    emoji: waste.emoji,
    label: waste.name,
    active: true,
    kindId: waste.id,
    isQualifiedCollect,
    coinValue: waste.coinValue,
    ecoScoreValue: waste.ecoScoreValue,
    carbonCreditValue: waste.carbonCreditValue,
    shieldChargeGain: waste.shieldChargeGain,
    wrongHandlingPenalty: waste.wrongHandlingPenalty,
    feedbackText: waste.feedbackText,
    collectibleClass: waste.collectibleClass,
    requiresShieldForQualified: waste.requiresShieldForQualified
  }
}
