import { getEcoNaveStage } from '@/engine/econave/data/stages'
import { getEcoNaveShip } from '@/engine/econave/data/ships'
import type {
  EcoNaveEntity,
  EcoNaveHudSnapshot,
  EcoNaveRenderQuality,
  EcoNaveRuntimeState,
  EcoNaveShipId,
  EcoNaveStageId
} from '@/types/econave'

export function createEcoNaveRuntimeState(
  stageId: EcoNaveStageId,
  shipId: EcoNaveShipId,
  quality: EcoNaveRenderQuality,
): EcoNaveRuntimeState {
  const stageConfig = getEcoNaveStage(stageId)
  const shipConfig = getEcoNaveShip(shipId)

  if (!stageConfig || !shipConfig) {
    throw new Error('Invalid EcoNave stage or ship selection.')
  }

  return {
    status: 'menu',
    stageId,
    stageConfig,
    shipConfig,
    elapsedMs: 0,
    timeLeftMs: stageConfig.durationSeconds * 1000,
    score: 0,
    combo: 0,
    comboBest: 0,
    creditsCollected: 0,
    player: {
      x: 0.5,
      y: 0.76,
      radius: 0.054,
      energy: shipConfig.stats.maxEnergy,
      maxEnergy: shipConfig.stats.maxEnergy,
      shieldHits: 0,
      pulseCharges: shipConfig.stats.startingPulseCharges,
      fireCooldownMs: 0,
      moveSpeed: shipConfig.stats.moveSpeed,
      magnetRadius: shipConfig.stats.magnetRadius,
      pulseRadius: shipConfig.stats.pulseRadius,
      effects: {
        magnetMs: 0,
        classifierMs: 0,
        turboMs: 0,
        slowMs: 0
      }
    },
    mission: {
      collectTarget: stageConfig.goals.collectTarget,
      neutralizeTarget: stageConfig.goals.neutralizeTarget,
      protectTarget: stageConfig.goals.protectTarget,
      ecoScoreTarget: stageConfig.goals.ecoScoreTarget,
      collectedCorrect: 0,
      neutralizedHazards: 0,
      protectedSatellites: 0,
      satellitesLost: 0,
      ecoScore: 0
    },
    entities: [],
    projectiles: [],
    particles: [],
    backgroundOffset: 0,
    cameraShakeMs: 0,
    nextEntitySpawnMs: 450,
    nextPowerUpSpawnMs: 2800,
    nextBonusSpawnMs: 3600,
    nextBossMinionSpawnMs: stageConfig.boss?.minionIntervalMs ?? 0,
    bossSpawned: false,
    bossDefeated: false,
    bossHp: stageConfig.boss?.hitPoints ?? 0,
    bossMaxHp: stageConfig.boss?.hitPoints ?? 0,
    stageWarningIssued: quality === 'eco',
    lastFeedback: null,
    nextId: 1
  }
}

export function createEcoNaveRuntimeId(state: EcoNaveRuntimeState, prefix: string) {
  const next = `${prefix}-${state.nextId}`
  state.nextId += 1
  return next
}

export function createEcoNaveParticleBurst(
  state: EcoNaveRuntimeState,
  input: {
    x: number
    y: number
    color: number
    size: number
    amount?: number
  },
) {
  const amount = input.amount ?? 6

  for (let index = 0; index < amount; index += 1) {
    const angle = (Math.PI * 2 * index) / amount
    const speed = 0.08 + Math.random() * 0.08
    state.particles.push({
      id: createEcoNaveRuntimeId(state, 'particle'),
      x: input.x,
      y: input.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      ttlMs: 340 + Math.random() * 220,
      maxTtlMs: 560,
      size: input.size,
      color: input.color,
      alpha: 1
    })
  }
}

export function createHudSnapshot(state: EcoNaveRuntimeState): EcoNaveHudSnapshot {
  return {
    status: state.status,
    score: state.score,
    combo: state.combo,
    energy: Math.max(0, Math.round(state.player.energy)),
    maxEnergy: state.player.maxEnergy,
    pulseCharges: state.player.pulseCharges,
    timeLeftSeconds: Math.max(0, Number((state.timeLeftMs / 1000).toFixed(1))),
    collectedCorrect: state.mission.collectedCorrect,
    collectTarget: state.mission.collectTarget,
    neutralizedHazards: state.mission.neutralizedHazards,
    neutralizeTarget: state.mission.neutralizeTarget,
    protectedSatellites: state.mission.protectedSatellites,
    protectTarget: state.mission.protectTarget,
    ecoScore: state.mission.ecoScore,
    ecoScoreTarget: state.mission.ecoScoreTarget,
    bossHp: state.bossHp,
    bossMaxHp: state.bossMaxHp,
    activeEffects: { ...state.player.effects }
  }
}

export function removeInactiveEcoNaveEntities<T extends EcoNaveEntity | { active: boolean }>(items: T[]) {
  return items.filter((item) => item.active)
}
