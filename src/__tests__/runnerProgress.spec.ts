import { beforeEach, describe, expect, it } from 'vitest'
import { runnerProgressService } from '@/services/runnerProgress.service'

describe('runner progress service', () => {
  beforeEach(() => {
    runnerProgressService.clear()
  })

  it('stores rewards, unlocks the next round and unlocks affordable vehicles', () => {
    const { progress, nextRoundUnlocked, newlyUnlockedVehicleIds } = runnerProgressService.applyRoundRewards({
      coinsEarned: 140,
      carbonCreditsEarned: 30,
      roundNumber: 2,
      victoryAchieved: true,
      rankingEntry: {
        playerName: 'Jogador',
        roundNumber: 2,
        vehicleId: 'recycled_skate',
        completionStatus: 'victory',
        timeSpentSeconds: 90,
        timeRemainingSeconds: 10,
        distanceTravelled: 2000,
        qualifiedCollects: 12,
        coinsCollected: 140,
        ecoScore: 40,
        carbonCreditsEarned: 30,
        collisionsTaken: 1,
        shieldUses: 1,
        shieldBlocks: 1,
        scoreFinal: 900,
        playedAt: new Date('2026-03-15T12:00:00.000Z').toISOString()
      }
    })

    expect(progress.highestUnlockedRound).toBe(3)
    expect(nextRoundUnlocked).toBe(true)
    expect(progress.totalCoins).toBe(140)
    expect(progress.totalCarbonCredits).toBe(30)
    expect(newlyUnlockedVehicleIds).toContain('electric_scooter')
    expect(progress.unlockedVehicleIds).toContain('electric_scooter')
  })
})
