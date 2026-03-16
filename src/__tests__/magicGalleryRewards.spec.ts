import { describe, expect, it } from 'vitest'

import {
  createQuizReward,
  getMagicGalleryUnlockCost,
  mergeMagicGalleryRewards
} from '@/engine/magic-gallery/rewards'

describe('magic gallery rewards', () => {
  it('assigns higher unlock costs to rarer characters', () => {
    expect(getMagicGalleryUnlockCost('legendary')).toBeGreaterThan(getMagicGalleryUnlockCost('common'))
    expect(getMagicGalleryUnlockCost('epic')).toBeGreaterThan(getMagicGalleryUnlockCost('rare'))
  })

  it('improves the quiz reward when the player answers more questions correctly', () => {
    const lowReward = createQuizReward(1, 5)
    const highReward = createQuizReward(5, 5)

    expect(highReward.magicDust).toBeGreaterThan(lowReward.magicDust)
    expect(highReward.bonusStars).toBeGreaterThanOrEqual(lowReward.bonusStars)
  })

  it('merges multiple rewards into one summary payload', () => {
    const merged = mergeMagicGalleryRewards('mission', 'Pacote do dia', [
      {
        source: 'mission',
        label: 'A',
        magicDust: 10,
        bonusStars: 1,
        unlockCharacterIds: ['mickey-mouse']
      },
      {
        source: 'quiz',
        label: 'B',
        magicDust: 12,
        bonusStars: 2,
        unlockCharacterIds: ['moana']
      }
    ])

    expect(merged.magicDust).toBe(22)
    expect(merged.bonusStars).toBe(3)
    expect(merged.unlockCharacterIds).toEqual(['mickey-mouse', 'moana'])
  })
})
