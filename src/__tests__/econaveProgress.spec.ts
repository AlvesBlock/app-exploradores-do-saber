import { beforeEach, describe, expect, it } from 'vitest'
import { econaveProgressService } from '@/services/econaveProgress.service'
import type { EcoNaveStageResult } from '@/types/econave'

function makeResult(overrides: Partial<EcoNaveStageResult>): EcoNaveStageResult {
  return {
    stageId: 'earth_orbit',
    victory: true,
    score: 820,
    starsEarned: 3,
    ecoCreditsEarned: 140,
    ecoScore: 92,
    collectedCorrect: 14,
    neutralizedHazards: 9,
    protectedSatellites: 4,
    satellitesLost: 0,
    comboBest: 11,
    bossDefeated: false,
    nextStageUnlocked: false,
    newlyUnlockedShipIds: [],
    educationalCard: {
      title: 'Card',
      fact: 'Fact',
      tip: 'Tip',
      summary: 'Summary'
    },
    summaryLines: ['Linha 1'],
    completedAt: new Date('2026-03-17T12:00:00.000Z').toISOString(),
    ...overrides
  }
}

describe('econave progress service', () => {
  beforeEach(() => {
    econaveProgressService.clear()
    localStorage.clear()
  })

  it('initializes only the first stage as unlocked', () => {
    const progress = econaveProgressService.get()

    expect(progress.stages.earth_orbit.unlocked).toBe(true)
    expect(progress.stages.debris_belt.unlocked).toBe(false)
    expect(progress.unlockedShipIds).toEqual(['aurora_seed'])
  })

  it('stores a victory, unlocks the next stage and unlocks ships by credits', () => {
    const result = econaveProgressService.applyStageResult(makeResult({}))

    expect(result.nextStageUnlocked).toBe(true)
    expect(result.progress.stages.earth_orbit.bestStars).toBe(3)
    expect(result.progress.stages.debris_belt.unlocked).toBe(true)
    expect(result.progress.ecoCredits).toBe(140)
    expect(result.newlyUnlockedShipIds).toContain('solar_wing')
    expect(result.progress.unlockedShipIds).toContain('solar_wing')
  })

  it('persists settings and selection defensively', () => {
    econaveProgressService.applyStageResult(makeResult({ ecoCreditsEarned: 300, bossDefeated: true }))
    const selected = econaveProgressService.selectShip('gaia_guard')
    const updated = econaveProgressService.updateSettings({
      muted: true,
      musicMuted: true,
      sfxVolume: 0.55,
      quality: 'eco'
    })

    expect(selected.selectedShipId).toBe('gaia_guard')
    expect(updated.settings.muted).toBe(true)
    expect(updated.settings.musicMuted).toBe(true)
    expect(updated.settings.sfxVolume).toBe(0.55)
    expect(updated.settings.quality).toBe('eco')
  })
})
