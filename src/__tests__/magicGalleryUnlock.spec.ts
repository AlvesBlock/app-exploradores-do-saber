import { describe, expect, it } from 'vitest'

import { resolveMagicGalleryUnlockStatus } from '@/engine/magic-gallery/unlock'
import type { MagicGalleryProgress } from '@/types/magic-gallery'
import type { ModuleProgress } from '@/types/module'

function createModuleProgress(moduleId: ModuleProgress['moduleId'], completedAt: string | null): ModuleProgress {
  return {
    moduleId,
    unlocked: true,
    completedDays: completedAt ? 5 : 0,
    earnedStars: 0,
    sessionsCompleted: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    bestAccuracy: 0,
    currentStreak: 0,
    lastPlayedOn: null,
    masteredQuestionIds: [],
    reviewQuestionIds: [],
    recentQuestionIds: [],
    activeSession: null,
    lastSessionSummary: null,
    completedAt
  }
}

function createMagicGalleryProgress(overrides: Partial<MagicGalleryProgress> = {}): MagicGalleryProgress {
  return {
    featureId: 'magic-gallery',
    unlockedAt: null,
    unlockCelebrationSeenAt: null,
    firstVisitedAt: null,
    lastVisitedAt: null,
    magicDust: 0,
    bonusStarsEarned: 0,
    unlockedCharacterIds: [],
    seenCharacterIds: [],
    rewardLedger: [],
    memory: {
      sessionsPlayed: 0,
      bestMoves: null,
      completedLevelIds: [],
      lastPlayedAt: null
    },
    quiz: {
      sessionsPlayed: 0,
      bestScore: 0,
      lastScore: 0,
      currentStreak: 0,
      lastPlayedOn: null
    },
    missions: {
      dateKey: null,
      counters: {
        dailyRevealCount: 0,
        memoryWins: 0,
        quizzesCompleted: 0,
        galleryUnlocks: 0
      },
      claims: []
    },
    dailyHighlight: {
      dateKey: null,
      characterId: null,
      revealedOn: null,
      rewardClaimedDateKeys: []
    },
    ...overrides
  }
}

describe('magic gallery unlock rules', () => {
  it('keeps the premium card locked while required modules are incomplete', () => {
    const moduleProgress = [
      createModuleProgress('math', '2026-03-16T10:00:00.000Z'),
      createModuleProgress('geography', null),
      createModuleProgress('science', null),
      createModuleProgress('language', null)
    ]

    const status = resolveMagicGalleryUnlockStatus(moduleProgress, createMagicGalleryProgress())

    expect(status.unlocked).toBe(false)
    expect(status.status).toBe('locked')
    expect(status.remainingModules).toBe(3)
  })

  it('reports just-unlocked when all modules are done and celebration is pending', () => {
    const moduleProgress = [
      createModuleProgress('math', '2026-03-16T10:00:00.000Z'),
      createModuleProgress('geography', '2026-03-16T10:00:00.000Z'),
      createModuleProgress('science', '2026-03-16T10:00:00.000Z'),
      createModuleProgress('language', '2026-03-16T10:00:00.000Z')
    ]

    const status = resolveMagicGalleryUnlockStatus(
      moduleProgress,
      createMagicGalleryProgress({
        unlockedAt: '2026-03-16T10:05:00.000Z'
      }),
    )

    expect(status.unlocked).toBe(true)
    expect(status.status).toBe('just-unlocked')
    expect(status.celebrationPending).toBe(true)
  })
})
