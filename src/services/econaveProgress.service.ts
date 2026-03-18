import { ECONAVE_STAGE_ORDER } from '@/engine/econave/data/stages'
import { ECONAVE_SHIPS } from '@/engine/econave/data/ships'
import type {
  EcoNavePersistentProgress,
  EcoNavePreferences,
  EcoNaveProgressApplyResult,
  EcoNaveRenderQuality,
  EcoNaveShipId,
  EcoNaveStageId,
  EcoNaveStageProgress,
  EcoNaveStageResult
} from '@/types/econave'

const STORAGE_KEY = 'exploradores-econave-progress'
const STORAGE_VERSION = 1

function createDefaultStageProgress(stageId: EcoNaveStageId, index: number): EcoNaveStageProgress {
  return {
    stageId,
    unlocked: index === 0,
    attempts: 0,
    completions: 0,
    bestScore: 0,
    bestStars: 0,
    bestEcoScore: 0,
    highCombo: 0,
    lastPlayedAt: null,
    completedAt: null
  }
}

function createDefaultStages() {
  return ECONAVE_STAGE_ORDER.reduce<Record<EcoNaveStageId, EcoNaveStageProgress>>((accumulator, stageId, index) => {
    accumulator[stageId] = createDefaultStageProgress(stageId, index)
    return accumulator
  }, {} as Record<EcoNaveStageId, EcoNaveStageProgress>)
}

function createDefaultPreferences(): EcoNavePreferences {
  return {
    muted: false,
    musicMuted: false,
    sfxVolume: 0.72,
    musicVolume: 0.42,
    quality: 'high'
  }
}

function createDefaultProgress(): EcoNavePersistentProgress {
  return {
    version: STORAGE_VERSION,
    ecoCredits: 0,
    totalStars: 0,
    highestUnlockedStage: 1,
    selectedShipId: 'aurora_seed',
    unlockedShipIds: ['aurora_seed'],
    achievements: [],
    settings: createDefaultPreferences(),
    stages: createDefaultStages()
  }
}

function normalizeQuality(value: unknown): EcoNaveRenderQuality {
  if (value === 'eco' || value === 'balanced') {
    return value
  }

  return 'high'
}

function normalizeSettings(raw: Partial<EcoNavePreferences> | null): EcoNavePreferences {
  return {
    muted: raw?.muted === true,
    musicMuted: raw?.musicMuted === true,
    sfxVolume:
      typeof raw?.sfxVolume === 'number' ? Math.min(1, Math.max(0, raw.sfxVolume)) : 0.72,
    musicVolume:
      typeof raw?.musicVolume === 'number' ? Math.min(1, Math.max(0, raw.musicVolume)) : 0.42,
    quality: normalizeQuality(raw?.quality)
  }
}

function normalizeProgress(raw: Partial<EcoNavePersistentProgress> | null): EcoNavePersistentProgress {
  const defaults = createDefaultProgress()

  const stages = ECONAVE_STAGE_ORDER.reduce<Record<EcoNaveStageId, EcoNaveStageProgress>>((accumulator, stageId, index) => {
    const currentStage = raw?.stages?.[stageId]
    accumulator[stageId] = {
      ...createDefaultStageProgress(stageId, index),
      ...currentStage,
      stageId,
      unlocked: typeof currentStage?.unlocked === 'boolean' ? currentStage.unlocked : index === 0,
      attempts:
        typeof currentStage?.attempts === 'number' ? Math.max(0, currentStage.attempts) : 0,
      completions:
        typeof currentStage?.completions === 'number' ? Math.max(0, currentStage.completions) : 0,
      bestScore:
        typeof currentStage?.bestScore === 'number' ? Math.max(0, currentStage.bestScore) : 0,
      bestStars:
        typeof currentStage?.bestStars === 'number' ? Math.min(3, Math.max(0, currentStage.bestStars)) : 0,
      bestEcoScore:
        typeof currentStage?.bestEcoScore === 'number' ? Math.max(0, currentStage.bestEcoScore) : 0,
      highCombo:
        typeof currentStage?.highCombo === 'number' ? Math.max(0, currentStage.highCombo) : 0,
      lastPlayedAt: typeof currentStage?.lastPlayedAt === 'string' ? currentStage.lastPlayedAt : null,
      completedAt: typeof currentStage?.completedAt === 'string' ? currentStage.completedAt : null
    }
    return accumulator
  }, {} as Record<EcoNaveStageId, EcoNaveStageProgress>)

  const unlockedShipIds = Array.from(
    new Set(
      (Array.isArray(raw?.unlockedShipIds) ? raw.unlockedShipIds : ['aurora_seed']).filter(
        (shipId): shipId is EcoNaveShipId =>
          typeof shipId === 'string' &&
          ECONAVE_SHIPS.some((ship) => ship.id === shipId),
      ),
    ),
  )

  if (!unlockedShipIds.includes('aurora_seed')) {
    unlockedShipIds.unshift('aurora_seed')
  }

  const selectedShipId = unlockedShipIds.includes(raw?.selectedShipId as EcoNaveShipId)
    ? (raw?.selectedShipId as EcoNaveShipId)
    : 'aurora_seed'

  const highestUnlockedStage =
    typeof raw?.highestUnlockedStage === 'number'
      ? Math.min(ECONAVE_STAGE_ORDER.length, Math.max(1, raw.highestUnlockedStage))
      : 1

  return {
    ...defaults,
    ...raw,
    version: STORAGE_VERSION,
    ecoCredits: typeof raw?.ecoCredits === 'number' ? Math.max(0, raw.ecoCredits) : 0,
    selectedShipId,
    unlockedShipIds,
    achievements: Array.isArray(raw?.achievements)
      ? raw.achievements.filter((item): item is string => typeof item === 'string')
      : [],
    settings: normalizeSettings(raw?.settings ?? null),
    highestUnlockedStage,
    stages,
    totalStars: ECONAVE_STAGE_ORDER.reduce((sum, stageId) => sum + stages[stageId].bestStars, 0)
  }
}

function save(progress: EcoNavePersistentProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

function getAchievementUnlocks(progress: EcoNavePersistentProgress, result: EcoNaveStageResult) {
  const unlocked = new Set(progress.achievements)
  const newAchievements: string[] = []

  const candidates = [
    result.victory ? 'first_orbit_clear' : null,
    result.satellitesLost === 0 && result.victory ? 'satellite_guardian' : null,
    result.bossDefeated && result.victory ? 'junk_titan_defeated' : null
  ]

  candidates.forEach((candidate) => {
    if (candidate && !unlocked.has(candidate)) {
      unlocked.add(candidate)
      newAchievements.push(candidate)
    }
  })

  return {
    achievements: Array.from(unlocked),
    newlyUnlockedAchievements: newAchievements
  }
}

export const econaveProgressService = {
  get(): EcoNavePersistentProgress {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const defaults = createDefaultProgress()
      save(defaults)
      return defaults
    }

    try {
      const parsed = JSON.parse(raw) as Partial<EcoNavePersistentProgress>
      const normalized = normalizeProgress(parsed)
      save(normalized)
      return normalized
    } catch {
      const defaults = createDefaultProgress()
      save(defaults)
      return defaults
    }
  },

  save(progress: EcoNavePersistentProgress) {
    const normalized = normalizeProgress(progress)
    save(normalized)
    return normalized
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY)
  },

  selectShip(shipId: EcoNaveShipId) {
    const progress = this.get()
    if (!progress.unlockedShipIds.includes(shipId)) {
      return progress
    }

    return this.save({
      ...progress,
      selectedShipId: shipId
    })
  },

  updateSettings(partial: Partial<EcoNavePreferences>) {
    const progress = this.get()

    return this.save({
      ...progress,
      settings: {
        ...progress.settings,
        ...partial,
        quality: normalizeQuality(partial.quality ?? progress.settings.quality)
      }
    })
  },

  applyStageResult(result: EcoNaveStageResult): EcoNaveProgressApplyResult {
    const progress = this.get()
    const currentStage = progress.stages[result.stageId]
    const nextStageIndex = ECONAVE_STAGE_ORDER.indexOf(result.stageId) + 1
    const nextStageId = ECONAVE_STAGE_ORDER[nextStageIndex] ?? null

    const updatedStages = {
      ...progress.stages,
      [result.stageId]: {
        ...currentStage,
        attempts: currentStage.attempts + 1,
        completions: currentStage.completions + (result.victory ? 1 : 0),
        bestScore: Math.max(currentStage.bestScore, result.score),
        bestStars: Math.max(currentStage.bestStars, result.starsEarned),
        bestEcoScore: Math.max(currentStage.bestEcoScore, result.ecoScore),
        highCombo: Math.max(currentStage.highCombo, result.comboBest),
        lastPlayedAt: result.completedAt,
        completedAt: result.victory ? result.completedAt : currentStage.completedAt
      }
    }

    let nextStageUnlocked = false

    if (result.victory && nextStageId && !updatedStages[nextStageId].unlocked) {
      updatedStages[nextStageId] = {
        ...updatedStages[nextStageId],
        unlocked: true
      }
      nextStageUnlocked = true
    }

    const ecoCredits = progress.ecoCredits + result.ecoCreditsEarned
    const unlockedShipIds = Array.from(
      new Set(
        ECONAVE_SHIPS.filter((ship) => ecoCredits >= ship.unlockCredits)
          .map((ship) => ship.id)
          .concat(progress.unlockedShipIds),
      ),
    ) as EcoNaveShipId[]

    const newlyUnlockedShipIds = unlockedShipIds.filter((shipId) => !progress.unlockedShipIds.includes(shipId))
    const highestUnlockedStage = Math.max(
      progress.highestUnlockedStage,
      nextStageUnlocked ? nextStageIndex + 1 : ECONAVE_STAGE_ORDER.indexOf(result.stageId) + 1,
    )

    const achievementResult = getAchievementUnlocks(progress, result)

    const updatedProgress = this.save({
      ...progress,
      ecoCredits,
      highestUnlockedStage: Math.min(ECONAVE_STAGE_ORDER.length, highestUnlockedStage),
      unlockedShipIds,
      achievements: achievementResult.achievements,
      stages: updatedStages
    })

    return {
      progress: updatedProgress,
      nextStageUnlocked,
      newlyUnlockedShipIds,
      newlyUnlockedAchievements: achievementResult.newlyUnlockedAchievements
    }
  }
}
