import { MAGIC_GALLERY_STARTER_CHARACTER_IDS } from '@/data/magic-gallery/magicGalleryCatalog.data'
import { pickMagicGalleryDailyCharacter } from '@/engine/magic-gallery/daily'
import { createMagicGalleryDailyMissions } from '@/engine/magic-gallery/missions'
import {
  createDailyHighlightReward,
  createMemoryReward,
  createQuizReward,
  createStarterPackReward,
  getMagicGalleryUnlockCost
} from '@/engine/magic-gallery/rewards'
import { resolveMagicGalleryUnlockStatus, canUnlockMagicGallery } from '@/engine/magic-gallery/unlock'
import { playerProfileService } from '@/services/playerProfile.service'
import type { ModuleProgress } from '@/types/module'
import type {
  MagicGalleryActivityCounters,
  MagicGalleryCharacter,
  MagicGalleryDailyHighlight,
  MagicGalleryGalleryItem,
  MagicGalleryMemoryLevelId,
  MagicGalleryMemorySessionSummary,
  MagicGalleryMission,
  MagicGalleryProgress,
  MagicGalleryQuizSessionSummary,
  MagicGalleryReward,
  MagicGalleryRewardLedgerEntry
} from '@/types/magic-gallery'

const STORAGE_KEY = 'exploradores-magic-gallery-progress'
const REWARD_LEDGER_LIMIT = 10

function getDateKey() {
  return new Date().toISOString().slice(0, 10)
}

function createDefaultCounters(): MagicGalleryActivityCounters {
  return {
    dailyRevealCount: 0,
    memoryWins: 0,
    quizzesCompleted: 0,
    galleryUnlocks: 0
  }
}

function createDefaultProgress(): MagicGalleryProgress {
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
      counters: createDefaultCounters(),
      claims: []
    },
    dailyHighlight: {
      dateKey: null,
      characterId: null,
      revealedOn: null,
      rewardClaimedDateKeys: []
    }
  }
}

function normalizeStringList(values: unknown) {
  return Array.isArray(values) ? values.filter((item): item is string => typeof item === 'string') : []
}

function normalizeRewardLedger(values: unknown): MagicGalleryRewardLedgerEntry[] {
  if (!Array.isArray(values)) return []

  return values
    .filter((item): item is MagicGalleryRewardLedgerEntry => !!item && typeof item === 'object')
    .map((item) => ({
      id: String(item.id),
      source: item.source,
      label: String(item.label),
      magicDust: Number.isFinite(item.magicDust) ? Number(item.magicDust) : 0,
      bonusStars: Number.isFinite(item.bonusStars) ? Number(item.bonusStars) : 0,
      unlockCharacterIds: normalizeStringList(item.unlockCharacterIds),
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString()
    }))
    .slice(0, REWARD_LEDGER_LIMIT)
}

function normalizeProgress(rawProgress: Partial<MagicGalleryProgress> | null): MagicGalleryProgress {
  const defaults = createDefaultProgress()
  if (!rawProgress) return defaults

  return {
    featureId: 'magic-gallery',
    unlockedAt: typeof rawProgress.unlockedAt === 'string' ? rawProgress.unlockedAt : null,
    unlockCelebrationSeenAt:
      typeof rawProgress.unlockCelebrationSeenAt === 'string' ? rawProgress.unlockCelebrationSeenAt : null,
    firstVisitedAt: typeof rawProgress.firstVisitedAt === 'string' ? rawProgress.firstVisitedAt : null,
    lastVisitedAt: typeof rawProgress.lastVisitedAt === 'string' ? rawProgress.lastVisitedAt : null,
    magicDust: Number.isFinite(rawProgress.magicDust) ? Math.max(0, Number(rawProgress.magicDust)) : 0,
    bonusStarsEarned: Number.isFinite(rawProgress.bonusStarsEarned)
      ? Math.max(0, Number(rawProgress.bonusStarsEarned))
      : 0,
    unlockedCharacterIds: normalizeStringList(rawProgress.unlockedCharacterIds),
    seenCharacterIds: normalizeStringList(rawProgress.seenCharacterIds),
    rewardLedger: normalizeRewardLedger(rawProgress.rewardLedger),
    memory: {
      sessionsPlayed: Number.isFinite(rawProgress.memory?.sessionsPlayed)
        ? Math.max(0, Number(rawProgress.memory?.sessionsPlayed))
        : defaults.memory.sessionsPlayed,
      bestMoves: Number.isFinite(rawProgress.memory?.bestMoves)
        ? Math.max(0, Number(rawProgress.memory?.bestMoves))
        : defaults.memory.bestMoves,
      completedLevelIds: Array.isArray(rawProgress.memory?.completedLevelIds)
        ? rawProgress.memory!.completedLevelIds.filter(
            (levelId): levelId is MagicGalleryMemoryLevelId =>
              levelId === 'spark' || levelId === 'portal' || levelId === 'castle',
          )
        : defaults.memory.completedLevelIds,
      lastPlayedAt:
        typeof rawProgress.memory?.lastPlayedAt === 'string' ? rawProgress.memory.lastPlayedAt : null
    },
    quiz: {
      sessionsPlayed: Number.isFinite(rawProgress.quiz?.sessionsPlayed)
        ? Math.max(0, Number(rawProgress.quiz?.sessionsPlayed))
        : defaults.quiz.sessionsPlayed,
      bestScore: Number.isFinite(rawProgress.quiz?.bestScore)
        ? Math.max(0, Number(rawProgress.quiz?.bestScore))
        : defaults.quiz.bestScore,
      lastScore: Number.isFinite(rawProgress.quiz?.lastScore)
        ? Math.max(0, Number(rawProgress.quiz?.lastScore))
        : defaults.quiz.lastScore,
      currentStreak: Number.isFinite(rawProgress.quiz?.currentStreak)
        ? Math.max(0, Number(rawProgress.quiz?.currentStreak))
        : defaults.quiz.currentStreak,
      lastPlayedOn: typeof rawProgress.quiz?.lastPlayedOn === 'string' ? rawProgress.quiz.lastPlayedOn : null
    },
    missions: {
      dateKey: typeof rawProgress.missions?.dateKey === 'string' ? rawProgress.missions.dateKey : null,
      counters: {
        dailyRevealCount: Number.isFinite(rawProgress.missions?.counters?.dailyRevealCount)
          ? Math.max(0, Number(rawProgress.missions?.counters?.dailyRevealCount))
          : 0,
        memoryWins: Number.isFinite(rawProgress.missions?.counters?.memoryWins)
          ? Math.max(0, Number(rawProgress.missions?.counters?.memoryWins))
          : 0,
        quizzesCompleted: Number.isFinite(rawProgress.missions?.counters?.quizzesCompleted)
          ? Math.max(0, Number(rawProgress.missions?.counters?.quizzesCompleted))
          : 0,
        galleryUnlocks: Number.isFinite(rawProgress.missions?.counters?.galleryUnlocks)
          ? Math.max(0, Number(rawProgress.missions?.counters?.galleryUnlocks))
          : 0
      },
      claims: normalizeStringList(rawProgress.missions?.claims)
    },
    dailyHighlight: {
      dateKey:
        typeof rawProgress.dailyHighlight?.dateKey === 'string' ? rawProgress.dailyHighlight.dateKey : null,
      characterId:
        typeof rawProgress.dailyHighlight?.characterId === 'string'
          ? rawProgress.dailyHighlight.characterId
          : null,
      revealedOn:
        typeof rawProgress.dailyHighlight?.revealedOn === 'string'
          ? rawProgress.dailyHighlight.revealedOn
          : null,
      rewardClaimedDateKeys: normalizeStringList(rawProgress.dailyHighlight?.rewardClaimedDateKeys)
    }
  }
}

function pushRewardLedger(progress: MagicGalleryProgress, reward: MagicGalleryReward) {
  const ledgerEntry: MagicGalleryRewardLedgerEntry = {
    id: `${reward.source}:${Date.now()}:${progress.rewardLedger.length}`,
    source: reward.source,
    label: reward.label,
    magicDust: reward.magicDust,
    bonusStars: reward.bonusStars,
    unlockCharacterIds: reward.unlockCharacterIds,
    createdAt: new Date().toISOString()
  }

  progress.rewardLedger = [ledgerEntry, ...progress.rewardLedger].slice(0, REWARD_LEDGER_LIMIT)
}

function applyReward(progress: MagicGalleryProgress, reward: MagicGalleryReward) {
  progress.magicDust += reward.magicDust
  progress.bonusStarsEarned += reward.bonusStars
  progress.unlockedCharacterIds = Array.from(
    new Set([...progress.unlockedCharacterIds, ...reward.unlockCharacterIds]),
  )
  progress.seenCharacterIds = Array.from(new Set([...progress.seenCharacterIds, ...reward.unlockCharacterIds]))

  if (reward.magicDust > 0 || reward.bonusStars > 0 || reward.unlockCharacterIds.length > 0) {
    pushRewardLedger(progress, reward)
  }

  if (reward.bonusStars > 0) {
    playerProfileService.addStars(reward.bonusStars)
  }
}

function ensureMissionDate(progress: MagicGalleryProgress, dateKey: string) {
  if (progress.missions.dateKey === dateKey) return

  progress.missions = {
    dateKey,
    counters: createDefaultCounters(),
    claims: []
  }
}

function ensureDailyHighlightDate(progress: MagicGalleryProgress, dateKey: string, characterId: string) {
  if (progress.dailyHighlight.dateKey === dateKey && progress.dailyHighlight.characterId === characterId) return

  progress.dailyHighlight = {
    dateKey,
    characterId,
    revealedOn: null,
    rewardClaimedDateKeys: progress.dailyHighlight.rewardClaimedDateKeys
  }
}

export const magicGalleryProgressService = {
  get() {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      const defaults = createDefaultProgress()
      this.save(defaults)
      return defaults
    }

    try {
      const parsed = JSON.parse(raw) as Partial<MagicGalleryProgress>
      const normalized = normalizeProgress(parsed)
      this.save(normalized)
      return normalized
    } catch {
      const defaults = createDefaultProgress()
      this.save(defaults)
      return defaults
    }
  },

  save(progress: MagicGalleryProgress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  },

  reset() {
    this.save(createDefaultProgress())
  },

  syncUnlock(moduleProgressList: ModuleProgress[]) {
    const progress = this.get()

    if (canUnlockMagicGallery(moduleProgressList) && !progress.unlockedAt) {
      progress.unlockedAt = new Date().toISOString()
      applyReward(progress, createStarterPackReward([...MAGIC_GALLERY_STARTER_CHARACTER_IDS]))
      this.save(progress)
    }

    return resolveMagicGalleryUnlockStatus(moduleProgressList, progress)
  },

  getUnlockStatus(moduleProgressList: ModuleProgress[]) {
    return resolveMagicGalleryUnlockStatus(moduleProgressList, this.get())
  },

  isUnlocked(moduleProgressList?: ModuleProgress[]) {
    if (moduleProgressList) {
      return this.getUnlockStatus(moduleProgressList).unlocked
    }

    return !!this.get().unlockedAt
  },

  markUnlockCelebrationSeen() {
    const progress = this.get()
    if (progress.unlockCelebrationSeenAt) return

    progress.unlockCelebrationSeenAt = new Date().toISOString()
    this.save(progress)
  },

  markVisited() {
    const progress = this.get()
    const now = new Date().toISOString()

    if (!progress.firstVisitedAt) {
      progress.firstVisitedAt = now
    }

    progress.lastVisitedAt = now
    this.save(progress)
  },

  getGalleryItems(characters: MagicGalleryCharacter[]): MagicGalleryGalleryItem[] {
    const progress = this.get()

    return characters.map((character) => ({
      characterId: character.id,
      unlocked: progress.unlockedCharacterIds.includes(character.id),
      unlockedAt: progress.unlockedCharacterIds.includes(character.id) ? progress.unlockedAt : null,
      unlockCost: getMagicGalleryUnlockCost(character.rarity)
    }))
  },

  unlockCharacter(character: MagicGalleryCharacter) {
    const progress = this.get()

    if (progress.unlockedCharacterIds.includes(character.id)) {
      return { ok: false, message: 'Esse personagem ja faz parte do seu album.' }
    }

    const unlockCost = getMagicGalleryUnlockCost(character.rarity)
    if (progress.magicDust < unlockCost) {
      return { ok: false, message: 'Voce precisa de mais poeira magica para revelar essa figurinha.' }
    }

    ensureMissionDate(progress, getDateKey())
    progress.magicDust -= unlockCost
    progress.unlockedCharacterIds = [...progress.unlockedCharacterIds, character.id]
    progress.seenCharacterIds = Array.from(new Set([...progress.seenCharacterIds, character.id]))
    progress.missions.counters.galleryUnlocks += 1
    this.save(progress)

    return { ok: true, unlockCost }
  },

  addSeenCharacter(characterId: string) {
    const progress = this.get()
    progress.seenCharacterIds = Array.from(new Set([...progress.seenCharacterIds, characterId]))
    this.save(progress)
  },

  getDailyHighlight(characters: MagicGalleryCharacter[]): MagicGalleryDailyHighlight | null {
    if (characters.length === 0) return null

    const dateKey = getDateKey()
    const highlightCharacter = pickMagicGalleryDailyCharacter(characters, dateKey)
    if (!highlightCharacter) return null

    const progress = this.get()
    ensureMissionDate(progress, dateKey)
    ensureDailyHighlightDate(progress, dateKey, highlightCharacter.id)
    this.save(progress)

    return {
      dateKey,
      characterId: highlightCharacter.id,
      revealed: progress.dailyHighlight.dateKey === dateKey && !!progress.dailyHighlight.revealedOn,
      rewardClaimed: progress.dailyHighlight.rewardClaimedDateKeys.includes(dateKey),
      reward: createDailyHighlightReward(highlightCharacter.name)
    }
  },

  revealDailyHighlight(characters: MagicGalleryCharacter[]) {
    const dateKey = getDateKey()
    const progress = this.get()
    const highlightCharacter = pickMagicGalleryDailyCharacter(characters, dateKey)

    if (!highlightCharacter) return null

    ensureMissionDate(progress, dateKey)
    ensureDailyHighlightDate(progress, dateKey, highlightCharacter.id)

    if (progress.dailyHighlight.rewardClaimedDateKeys.includes(dateKey)) {
      return {
        reward: null,
        characterId: highlightCharacter.id
      }
    }

    progress.dailyHighlight.revealedOn = new Date().toISOString()
    progress.dailyHighlight.rewardClaimedDateKeys = [
      ...progress.dailyHighlight.rewardClaimedDateKeys,
      dateKey
    ]
    progress.missions.counters.dailyRevealCount += 1

    const reward = createDailyHighlightReward(highlightCharacter.name)
    applyReward(progress, reward)
    this.save(progress)

    return {
      reward,
      characterId: highlightCharacter.id
    }
  },

  getDailyMissions(characters: MagicGalleryCharacter[]): MagicGalleryMission[] {
    const dateKey = getDateKey()
    const progress = this.get()
    const highlightCharacter = pickMagicGalleryDailyCharacter(characters, dateKey)
    if (!highlightCharacter) return []

    ensureMissionDate(progress, dateKey)
    ensureDailyHighlightDate(progress, dateKey, highlightCharacter.id)
    this.save(progress)

    return createMagicGalleryDailyMissions(
      dateKey,
      highlightCharacter,
      progress.missions.counters,
      progress.missions.claims,
    )
  },

  claimMission(characters: MagicGalleryCharacter[], missionId: string) {
    const progress = this.get()
    const missions = this.getDailyMissions(characters)
    const mission = missions.find((entry) => entry.id === missionId)

    if (!mission) {
      return { ok: false, message: 'Missao nao encontrada.' }
    }

    if (!mission.completed) {
      return { ok: false, message: 'Complete a missao antes de resgatar a recompensa.' }
    }

    if (progress.missions.claims.includes(missionId)) {
      return { ok: false, message: 'Essa recompensa ja foi resgatada.' }
    }

    progress.missions.claims = [...progress.missions.claims, missionId]
    applyReward(progress, mission.reward)
    this.save(progress)

    return { ok: true, reward: mission.reward }
  },

  recordMemoryWin(levelId: MagicGalleryMemoryLevelId, moves: number): MagicGalleryMemorySessionSummary {
    const progress = this.get()
    const reward = createMemoryReward(levelId)
    const playedAt = new Date().toISOString()
    ensureMissionDate(progress, getDateKey())

    progress.memory.sessionsPlayed += 1
    progress.memory.bestMoves =
      progress.memory.bestMoves === null ? moves : Math.min(progress.memory.bestMoves, moves)
    progress.memory.completedLevelIds = Array.from(
      new Set([...progress.memory.completedLevelIds, levelId]),
    )
    progress.memory.lastPlayedAt = playedAt
    progress.missions.counters.memoryWins += 1

    applyReward(progress, reward)
    this.save(progress)

    return {
      levelId,
      moves,
      matches:
        levelId === 'spark' ? 3 : levelId === 'portal' ? 4 : 6,
      reward,
      playedAt
    }
  },

  recordQuizCompletion(correctAnswers: number, totalQuestions: number): MagicGalleryQuizSessionSummary {
    const progress = this.get()
    const playedAt = new Date().toISOString()
    const dateKey = getDateKey()
    const reward = createQuizReward(correctAnswers, totalQuestions)
    const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0

    ensureMissionDate(progress, dateKey)

    progress.quiz.sessionsPlayed += 1
    progress.quiz.lastScore = correctAnswers
    progress.quiz.bestScore = Math.max(progress.quiz.bestScore, correctAnswers)
    progress.quiz.currentStreak = accuracy >= 0.6 ? progress.quiz.currentStreak + 1 : 0
    progress.quiz.lastPlayedOn = dateKey
    progress.missions.counters.quizzesCompleted += 1

    applyReward(progress, reward)
    this.save(progress)

    return {
      totalQuestions,
      correctAnswers,
      accuracy,
      reward,
      playedAt
    }
  }
}
