import { gameModules } from '@/data/modules/modules.data'
import type { ModuleId, ModuleProgress } from '@/types/module'

const STORAGE_KEY = 'exploradores-module-progress'

function createDefaultProgress(): ModuleProgress[] {
  return gameModules.map((module, index) => ({
    moduleId: module.id,
    unlocked: index === 0,
    completedPhases: 0,
    earnedStars: 0,
    completedPhaseIds: []
  }))
}

export const moduleProgressService = {
  getAll(): ModuleProgress[] {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      const defaults = createDefaultProgress()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
      return defaults
    }

    try {
      const parsed = JSON.parse(raw) as ModuleProgress[]

      return parsed.map((item) => ({
        ...item,
        completedPhaseIds: item.completedPhaseIds ?? []
      }))
    } catch {
      const defaults = createDefaultProgress()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
      return defaults
    }
  },

  saveAll(progress: ModuleProgress[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  },

  getByModule(moduleId: ModuleId): ModuleProgress | null {
    return this.getAll().find((item) => item.moduleId === moduleId) ?? null
  },

  isPhaseCompleted(moduleId: ModuleId, phaseId: string): boolean {
    const module = this.getByModule(moduleId)
    return module?.completedPhaseIds.includes(phaseId) ?? false
  },

  completePhase(moduleId: ModuleId, phaseId: string, starsToAdd: number) {
    const progress = this.getAll()
    const currentIndex = progress.findIndex((item) => item.moduleId === moduleId)

    const currentModule = progress[currentIndex]
    if (!currentModule) return false

    const alreadyCompleted = currentModule.completedPhaseIds.includes(phaseId)
    if (alreadyCompleted) return false

    currentModule.completedPhaseIds.push(phaseId)
    currentModule.completedPhases += 1
    currentModule.earnedStars += starsToAdd

    const moduleConfig = gameModules.find((item) => item.id === moduleId)
    const totalPhases = moduleConfig?.totalPhases ?? 0

    const isModuleCompleted = currentModule.completedPhases >= totalPhases

    if (isModuleCompleted) {
      const nextIndex = currentIndex + 1
      const nextModule = progress[nextIndex]

      if (nextModule) {
        nextModule.unlocked = true
      }
    }

    this.saveAll(progress)
    return true
  },

  reset() {
    const defaults = createDefaultProgress()
    this.saveAll(defaults)
  }
}