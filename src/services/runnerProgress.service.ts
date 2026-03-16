import { RUNNER_VEHICLES } from '@/engine/runner/data/vehicles'
import type {
  RunnerPersistentProgress,
  RunnerRankingEntry
} from '@/types/runner-game'

const STORAGE_KEY = 'exploradores-runner-progress'

const DEFAULT_PROGRESS: RunnerPersistentProgress = {
  totalCoins: 0,
  totalCarbonCredits: 0,
  selectedVehicleId: 'recycled_skate',
  unlockedVehicleIds: ['recycled_skate'],
  highestUnlockedRound: 1,
  rankings: []
}

function normalizeProgress(progress: Partial<RunnerPersistentProgress> | null): RunnerPersistentProgress {
  const merged = {
    ...DEFAULT_PROGRESS,
    ...progress
  }

  const unlockedVehicleIds = Array.from(
    new Set(['recycled_skate', ...(merged.unlockedVehicleIds ?? [])])
  )

  const selectedVehicleId = unlockedVehicleIds.includes(merged.selectedVehicleId)
    ? merged.selectedVehicleId
    : 'recycled_skate'

  return {
    ...merged,
    selectedVehicleId,
    unlockedVehicleIds,
    highestUnlockedRound: Math.max(1, merged.highestUnlockedRound ?? 1),
    rankings: Array.isArray(merged.rankings) ? merged.rankings.slice(0, 20) : []
  }
}

function resolveNewUnlocks(progress: RunnerPersistentProgress): string[] {
  return RUNNER_VEHICLES.filter((vehicle) => {
    return (
      !progress.unlockedVehicleIds.includes(vehicle.id) &&
      progress.totalCoins >= vehicle.unlockCoins &&
      progress.totalCarbonCredits >= vehicle.unlockCarbonCredits
    )
  }).map((vehicle) => vehicle.id)
}

function sortRankings(rankings: RunnerRankingEntry[]): RunnerRankingEntry[] {
  return [...rankings]
    .sort((entryA, entryB) => {
      if (entryB.roundNumber !== entryA.roundNumber) {
        return entryB.roundNumber - entryA.roundNumber
      }

      return new Date(entryB.playedAt).getTime() - new Date(entryA.playedAt).getTime()
    })
    .slice(0, 20)
}

export const runnerProgressService = {
  get(): RunnerPersistentProgress {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return { ...DEFAULT_PROGRESS }
    }

    try {
      return normalizeProgress(JSON.parse(raw) as Partial<RunnerPersistentProgress>)
    } catch {
      return { ...DEFAULT_PROGRESS }
    }
  },

  save(progress: RunnerPersistentProgress): RunnerPersistentProgress {
    const normalized = normalizeProgress(progress)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    return normalized
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY)
  },

  selectVehicle(vehicleId: string): RunnerPersistentProgress {
    const progress = this.get()

    if (!progress.unlockedVehicleIds.includes(vehicleId)) {
      return progress
    }

    return this.save({
      ...progress,
      selectedVehicleId: vehicleId
    })
  },

  applyRoundRewards(input: {
    coinsEarned: number
    carbonCreditsEarned: number
    roundNumber: number
    victoryAchieved: boolean
    rankingEntry: RunnerRankingEntry
  }): {
    progress: RunnerPersistentProgress
    newlyUnlockedVehicleIds: string[]
    nextRoundUnlocked: boolean
  } {
    const current = this.get()
    const updatedProgress = normalizeProgress({
      ...current,
      totalCoins: current.totalCoins + Math.max(0, input.coinsEarned),
      totalCarbonCredits: current.totalCarbonCredits + Math.max(0, input.carbonCreditsEarned),
      highestUnlockedRound: input.victoryAchieved
        ? Math.max(current.highestUnlockedRound, Math.min(10, input.roundNumber + 1))
        : current.highestUnlockedRound,
      rankings: sortRankings([input.rankingEntry, ...current.rankings])
    })

    const newlyUnlockedVehicleIds = resolveNewUnlocks(updatedProgress)
    const progressWithUnlocks = this.save({
      ...updatedProgress,
      unlockedVehicleIds: [
        ...updatedProgress.unlockedVehicleIds,
        ...newlyUnlockedVehicleIds
      ]
    })

    return {
      progress: progressWithUnlocks,
      newlyUnlockedVehicleIds,
      nextRoundUnlocked: input.victoryAchieved && progressWithUnlocks.highestUnlockedRound > current.highestUnlockedRound
    }
  }
}
