import { shuffleWithSeed } from '@/engine/magic-gallery/random'
import type {
  MagicGalleryCharacter,
  MagicGalleryMemoryCard,
  MagicGalleryMemoryLevel,
  MagicGalleryMemoryLevelId
} from '@/types/magic-gallery'

export const magicGalleryMemoryLevels: MagicGalleryMemoryLevel[] = [
  {
    id: 'spark',
    title: 'Trilha das Estrelas',
    description: '3 pares para aquecer os olhos e a memoria.',
    pairCount: 3,
    rewardDust: 18,
    bonusStars: 1
  },
  {
    id: 'portal',
    title: 'Portal Dourado',
    description: '4 pares para criar conexoes mais rapidas.',
    pairCount: 4,
    rewardDust: 28,
    bonusStars: 1
  },
  {
    id: 'castle',
    title: 'Sala do Castelo',
    description: '6 pares para um desafio premium completo.',
    pairCount: 6,
    rewardDust: 42,
    bonusStars: 2
  }
]

export function getMagicGalleryMemoryLevel(levelId: MagicGalleryMemoryLevelId) {
  return magicGalleryMemoryLevels.find((level) => level.id === levelId) ?? magicGalleryMemoryLevels[0]!
}

export function generateMagicGalleryMemoryDeck(
  characters: MagicGalleryCharacter[],
  levelId: MagicGalleryMemoryLevelId,
  seed: string,
): MagicGalleryMemoryCard[] {
  const level = getMagicGalleryMemoryLevel(levelId)
  const selectedCharacters = shuffleWithSeed(characters, `${seed}:characters`).slice(0, level.pairCount)

  return shuffleWithSeed(
    selectedCharacters.flatMap((character) => [
      {
        id: `${character.id}:a`,
        pairId: character.id,
        characterId: character.id,
        label: character.name,
        imageUrl: character.imageUrl,
        emoji: character.emoji
      },
      {
        id: `${character.id}:b`,
        pairId: character.id,
        characterId: character.id,
        label: character.name,
        imageUrl: character.imageUrl,
        emoji: character.emoji
      }
    ]),
    `${seed}:deck`,
  )
}
