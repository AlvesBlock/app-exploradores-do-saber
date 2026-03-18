import { describe, expect, it } from 'vitest'
import {
  activateEcoNavePulse,
  injectEcoNaveEntity,
  startEcoNaveStage,
  stepEcoNaveRuntime
} from '@/engine/econave/runtime/simulation'

describe('econave runtime', () => {
  it('collects correct residues and tracks score in the running state', () => {
    const state = startEcoNaveStage('earth_orbit', 'aurora_seed', 'high')

    injectEcoNaveEntity(state, 'recycle_can', {
      x: state.player.x,
      y: state.player.y,
      vx: 0,
      vy: 0
    })

    stepEcoNaveRuntime(state, { moveX: 0, moveY: 0, firePressed: false }, 16)

    expect(state.mission.collectedCorrect).toBe(1)
    expect(state.score).toBeGreaterThan(0)
    expect(state.combo).toBeGreaterThan(0)
  })

  it('uses cleanup pulse as a real power-up against threats', () => {
    const state = startEcoNaveStage('debris_belt', 'aurora_seed', 'high')
    state.player.pulseCharges = 1

    injectEcoNaveEntity(state, 'battery_cluster', {
      x: state.player.x + 0.04,
      y: state.player.y - 0.12,
      vx: 0,
      vy: 0
    })

    activateEcoNavePulse(state)

    expect(state.player.pulseCharges).toBe(0)
    expect(state.mission.neutralizedHazards).toBe(1)
    expect(state.score).toBeGreaterThan(0)
  })

  it('finishes the boss stage with victory after the boss is defeated and goals are met', () => {
    const state = startEcoNaveStage('junk_boss', 'gaia_guard', 'high')
    state.mission.collectedCorrect = state.mission.collectTarget
    state.mission.neutralizedHazards = state.mission.neutralizeTarget
    state.mission.protectedSatellites = state.mission.protectTarget
    state.mission.ecoScore = state.mission.ecoScoreTarget
    state.player.pulseCharges = 1
    state.bossSpawned = true
    state.bossHp = 2
    state.bossMaxHp = 34

    injectEcoNaveEntity(state, 'junk_titan', {
      x: state.player.x + 0.03,
      y: state.player.y - 0.18,
      vx: 0,
      vy: 0,
      hp: 2,
      maxHp: 34
    })

    const events = activateEcoNavePulse(state)
    const resultEvent = events.find((event) => event.kind === 'result')

    expect(state.bossDefeated).toBe(true)
    expect(resultEvent?.result?.victory).toBe(true)
    expect(resultEvent?.result?.bossDefeated).toBe(true)
  })

  it('triggers defeat when energy is depleted', () => {
    const state = startEcoNaveStage('earth_orbit', 'aurora_seed', 'high')
    state.player.energy = 0

    const events = stepEcoNaveRuntime(state, { moveX: 0, moveY: 0, firePressed: false }, 16)
    const resultEvent = events.find((event) => event.kind === 'result')

    expect(resultEvent?.result?.victory).toBe(false)
    expect(state.status).toBe('defeat')
  })
})
