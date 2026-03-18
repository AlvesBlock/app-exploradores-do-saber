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
  const exactMatch = moduleQuestionBank.find((question) => question.id === questionId)
  if (exactMatch) {
    return exactMatch
  }

  const separatorIndex = questionId.indexOf('-')
  if (separatorIndex === -1) {
    return null
  }

  const modulePrefix = questionId.slice(0, separatorIndex)
  const legacySuffix = questionId.slice(separatorIndex + 1)

  return (
    moduleQuestionBank.find((question) => {
      return question.id.startsWith(`${modulePrefix}-`) && question.id.endsWith(`-${legacySuffix}`)
    }) ?? null
  )
}
