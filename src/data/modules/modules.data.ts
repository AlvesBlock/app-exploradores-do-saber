import { gameModules } from '@/data/modules/moduleCatalog.data'
import { moduleQuestionBank } from '@/data/modules/moduleQuestionBank.data'
import type { ModuleId, ModuleQuestion } from '@/types/module'

export { gameModules, moduleQuestionBank }

export function getModuleById(moduleId: ModuleId) {
  return gameModules.find((module) => module.id === moduleId) ?? null
}

export function getQuestionsByModule(moduleId: ModuleId): ModuleQuestion[] {
  return moduleQuestionBank.filter((question) => question.moduleId === moduleId)
}

export function getQuestionById(questionId: string): ModuleQuestion | null {
  return moduleQuestionBank.find((question) => question.id === questionId) ?? null
}

