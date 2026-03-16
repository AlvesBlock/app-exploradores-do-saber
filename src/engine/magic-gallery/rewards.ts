import type {
  MagicGalleryMemoryLevelId,
  MagicGalleryRarity,
  MagicGalleryReward
} from '@/types/magic-gallery'

const UNLOCK_COST_BY_RARITY: Record<MagicGalleryRarity, number> = {
  common: 30,
  rare: 45,
  epic: 60,
  legendary: 80
}

const MEMORY_REWARDS: Record<MagicGalleryMemoryLevelId, { magicDust: number; bonusStars: number }> = {
  spark: { magicDust: 18, bonusStars: 1 },
  portal: { magicDust: 28, bonusStars: 1 },
  castle: { magicDust: 42, bonusStars: 2 }
}

export function getMagicGalleryUnlockCost(rarity: MagicGalleryRarity) {
  return UNLOCK_COST_BY_RARITY[rarity]
}

export function createStarterPackReward(characterIds: string[]): MagicGalleryReward {
  return {
    source: 'starter-pack',
    label: 'Kit de boas-vindas Plus',
    magicDust: 48,
    bonusStars: 3,
    unlockCharacterIds: characterIds
  }
}

export function createDailyHighlightReward(characterName: string): MagicGalleryReward {
  return {
    source: 'daily-highlight',
    label: `Destaque diario de ${characterName}`,
    magicDust: 14,
    bonusStars: 1,
    unlockCharacterIds: []
  }
}

export function createMemoryReward(levelId: MagicGalleryMemoryLevelId): MagicGalleryReward {
  const reward = MEMORY_REWARDS[levelId]

  return {
    source: 'memory',
    label: `Memoria encantada ${levelId}`,
    magicDust: reward.magicDust,
    bonusStars: reward.bonusStars,
    unlockCharacterIds: []
  }
}

export function createQuizReward(correctAnswers: number, totalQuestions: number): MagicGalleryReward {
  const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0
  const magicDust = 12 + correctAnswers * 5
  const bonusStars = accuracy >= 0.8 ? 2 : accuracy >= 0.5 ? 1 : 0

  return {
    source: 'quiz',
    label: 'Quiz de descoberta',
    magicDust,
    bonusStars,
    unlockCharacterIds: []
  }
}

export function createMissionReward(
  missionKind: 'reveal-daily' | 'complete-memory' | 'complete-quiz' | 'unlock-gallery-item',
): MagicGalleryReward {
  switch (missionKind) {
    case 'reveal-daily':
      return {
        source: 'mission',
        label: 'Missao brilho do dia',
        magicDust: 12,
        bonusStars: 1,
        unlockCharacterIds: []
      }
    case 'complete-memory':
      return {
        source: 'mission',
        label: 'Missao jogo da memoria',
        magicDust: 18,
        bonusStars: 1,
        unlockCharacterIds: []
      }
    case 'complete-quiz':
      return {
        source: 'mission',
        label: 'Missao quiz de descoberta',
        magicDust: 18,
        bonusStars: 1,
        unlockCharacterIds: []
      }
    case 'unlock-gallery-item':
      return {
        source: 'mission',
        label: 'Missao album brilhante',
        magicDust: 24,
        bonusStars: 2,
        unlockCharacterIds: []
      }
  }
}

export function mergeMagicGalleryRewards(
  source: MagicGalleryReward['source'],
  label: string,
  rewards: MagicGalleryReward[],
): MagicGalleryReward {
  return rewards.reduce<MagicGalleryReward>(
    (merged, reward) => ({
      source,
      label,
      magicDust: merged.magicDust + reward.magicDust,
      bonusStars: merged.bonusStars + reward.bonusStars,
      unlockCharacterIds: Array.from(new Set([...merged.unlockCharacterIds, ...reward.unlockCharacterIds]))
    }),
    {
      source,
      label,
      magicDust: 0,
      bonusStars: 0,
      unlockCharacterIds: []
    },
  )
}
