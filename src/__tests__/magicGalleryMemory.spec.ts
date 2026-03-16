import { describe, expect, it } from 'vitest'

import { generateMagicGalleryMemoryDeck } from '@/engine/magic-gallery/memory'
import { magicGalleryContentService } from '@/services/magicGalleryContent.service'

describe('magic gallery memory deck generation', () => {
  it('creates a deterministic deck with paired cards for the selected level', () => {
    const characters = magicGalleryContentService.getFallbackSnapshot().characters
    const deck = generateMagicGalleryMemoryDeck(characters, 'portal', 'memory-seed')

    expect(deck).toHaveLength(8)
    expect(deck.map((card) => card.id)).toEqual(
      generateMagicGalleryMemoryDeck(characters, 'portal', 'memory-seed').map((card) => card.id),
    )

    const pairCounts = deck.reduce<Record<string, number>>((counts, card) => {
      counts[card.pairId] = (counts[card.pairId] ?? 0) + 1
      return counts
    }, {})

    expect(Object.values(pairCounts).every((count) => count === 2)).toBe(true)
  })
})
