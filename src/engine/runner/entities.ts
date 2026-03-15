import {
  RUNNER_COLLECTIBLES,
  RUNNER_LANES,
  RUNNER_OBSTACLES
} from '@/engine/runner/constants'
import type { LaneIndex, RunnerEntity } from '@/types/runner'

function randomFromArray<T>(items: readonly T[]): T {
  const item = items[Math.floor(Math.random() * items.length)];
  
  if (item === undefined) {
    throw new Error("Tentativa de selecionar item em um array vazio.");
  }
  
  return item;
}

function randomId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function createObstacleEntity(): RunnerEntity {
  return {
    id: randomId(),
    type: 'obstacle',
    lane: randomFromArray(RUNNER_LANES) as LaneIndex,
    depth: 0,
    emoji: randomFromArray(RUNNER_OBSTACLES),
    active: true
  }
}

export function createCollectibleEntity(): RunnerEntity {
  return {
    id: randomId(),
    type: 'collectible',
    lane: randomFromArray(RUNNER_LANES) as LaneIndex,
    depth: 0,
    emoji: randomFromArray(RUNNER_COLLECTIBLES),
    active: true
  }
}