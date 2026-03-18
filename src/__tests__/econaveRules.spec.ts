import { describe, expect, it } from 'vitest'
import {
  resolveEcoNavePlayerCollision,
  resolveEcoNaveProjectileHit,
  resolveEcoNavePulseHit
} from '@/engine/econave/runtime/rules'
import type { EcoNaveEntity } from '@/types/econave'

function makeEntity(overrides: Partial<EcoNaveEntity>): EcoNaveEntity {
  return {
    id: 'entity-1',
    blueprintId: 'recycle_can',
    kind: 'recyclable',
    handling: 'collect',
    emoji: '🥫',
    color: 0x38bdf8,
    x: 0.5,
    y: 0.5,
    vx: 0,
    vy: 0,
    radius: 0.03,
    hp: 1,
    maxHp: 1,
    damage: 0,
    scoreValue: 20,
    ecoValue: 8,
    creditValue: 5,
    powerUpType: null,
    active: true,
    angle: 0,
    angularVelocity: 0,
    ...overrides
  }
}

describe('econave rules', () => {
  it('rewards correct collection and punishes destroying recyclables without classifier', () => {
    const recyclable = makeEntity({})

    const collectResult = resolveEcoNavePlayerCollision(recyclable)
    const wrongShotResult = resolveEcoNaveProjectileHit(recyclable, false)

    expect(collectResult.collectDelta).toBe(1)
    expect(collectResult.positive).toBe(true)
    expect(collectResult.feedback.tone).toBe('positive')
    expect(wrongShotResult.scoreDelta).toBeLessThan(0)
    expect(wrongShotResult.ecoDelta).toBeLessThan(0)
    expect(wrongShotResult.feedback.tone).toBe('negative')
  })

  it('lets the classifier sort recyclables and power-ups grant actual effects', () => {
    const recyclable = makeEntity({})
    const shieldPowerUp = makeEntity({
      blueprintId: 'powerup_shield',
      kind: 'powerup',
      handling: 'collect',
      emoji: '🛡️',
      powerUpType: 'shield'
    })

    const classifierShot = resolveEcoNaveProjectileHit(recyclable, true)
    const powerUpResult = resolveEcoNavePlayerCollision(shieldPowerUp)

    expect(classifierShot.collectDelta).toBe(1)
    expect(classifierShot.positive).toBe(true)
    expect(classifierShot.feedback.icon).toBe('📷')
    expect(powerUpResult.powerUpGranted).toBe('shield')
    expect(powerUpResult.feedback.cue).toBe('powerup')
  })

  it('enforces protection rules for hazards, satellites and cleanup pulse', () => {
    const hazard = makeEntity({
      blueprintId: 'battery_cluster',
      kind: 'hazard',
      handling: 'neutralize',
      emoji: '🔋',
      damage: 16
    })
    const satellite = makeEntity({
      blueprintId: 'relay_satellite',
      kind: 'satellite',
      handling: 'protect',
      emoji: '🛰️',
      damage: 12
    })
    const obstacle = makeEntity({
      blueprintId: 'asteroid_chunk',
      kind: 'obstacle',
      handling: 'avoid',
      emoji: '🪨',
      damage: 14
    })

    const hazardResult = resolveEcoNaveProjectileHit(hazard, false)
    const satelliteResult = resolveEcoNaveProjectileHit(satellite, false)
    const pulseResult = resolveEcoNavePulseHit(obstacle)

    expect(hazardResult.neutralizeDelta).toBe(1)
    expect(hazardResult.feedback.tone).toBe('positive')
    expect(satelliteResult.lostSatelliteDelta).toBe(1)
    expect(satelliteResult.feedback.tone).toBe('negative')
    expect(pulseResult.positive).toBe(true)
    expect(pulseResult.feedback.cue).toBe('pulse')
  })
})
