import { gameModules } from '@/data/modules/modules.data'
import { moduleQuizService } from '@/services/moduleQuiz.service'
import type {
  ModuleId,
  ModuleProgress,
  ModuleQuestion,
  ModuleQuizSession,
  ModuleSessionSummary,
  QuizAnswerRecord
} from '@/types/module'

const STORAGE_KEY = 'exploradores-module-progress'
const LEGACY_PHASE_TOTAL = 3

function createDefaultProgress(): ModuleProgress[] {
  return gameModules.map((module, index) => ({
    moduleId: module.id,
    unlocked: index === 0,
    completedDays: 0,
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
    completedAt: null
  }))
}

function uniqueTail(values: string[], limit: number) {
  return Array.from(new Set(values)).slice(-limit)
}

function normalizeProgress(
  rawProgress: Partial<ModuleProgress> & Record<string, unknown>,
  index: number,
  moduleConfig: (typeof gameModules)[number],
) {
  const legacyCompletedPhases =
    typeof rawProgress.completedPhases === 'number' ? rawProgress.completedPhases : 0
  const ratioFromLegacy =
    LEGACY_PHASE_TOTAL > 0 ? Math.min(1, legacyCompletedPhases / LEGACY_PHASE_TOTAL) : 0
  const completedDaysFromLegacy = Math.round(ratioFromLegacy * moduleConfig.totalDays)
  const completedDays = Math.max(
    0,
    Math.min(
      moduleConfig.totalDays,
      Number.isFinite(rawProgress.completedDays)
        ? Number(rawProgress.completedDays)
        : completedDaysFromLegacy,
    ),
  )

  const completedAt =
    completedDays >= moduleConfig.totalDays
      ? (typeof rawProgress.completedAt === 'string' ? rawProgress.completedAt : new Date().toISOString())
      : null

  return {
    moduleId: moduleConfig.id,
    unlocked: typeof rawProgress.unlocked === 'boolean' ? rawProgress.unlocked : index === 0,
    completedDays,
    earnedStars: Number.isFinite(rawProgress.earnedStars) ? Number(rawProgress.earnedStars) : 0,
    sessionsCompleted: Number.isFinite(rawProgress.sessionsCompleted)
      ? Number(rawProgress.sessionsCompleted)
      : completedDays,
    totalAnswered: Number.isFinite(rawProgress.totalAnswered) ? Number(rawProgress.totalAnswered) : 0,
    totalCorrect: Number.isFinite(rawProgress.totalCorrect) ? Number(rawProgress.totalCorrect) : 0,
    bestAccuracy: Number.isFinite(rawProgress.bestAccuracy) ? Number(rawProgress.bestAccuracy) : 0,
    currentStreak: Number.isFinite(rawProgress.currentStreak) ? Number(rawProgress.currentStreak) : 0,
    lastPlayedOn: typeof rawProgress.lastPlayedOn === 'string' ? rawProgress.lastPlayedOn : null,
    masteredQuestionIds: Array.isArray(rawProgress.masteredQuestionIds)
      ? rawProgress.masteredQuestionIds.filter((item): item is string => typeof item === 'string')
      : [],
    reviewQuestionIds: Array.isArray(rawProgress.reviewQuestionIds)
      ? rawProgress.reviewQuestionIds.filter((item): item is string => typeof item === 'string')
      : [],
    recentQuestionIds: Array.isArray(rawProgress.recentQuestionIds)
      ? rawProgress.recentQuestionIds.filter((item): item is string => typeof item === 'string')
      : [],
    activeSession:
      rawProgress.activeSession && typeof rawProgress.activeSession === 'object'
        ? (rawProgress.activeSession as ModuleQuizSession)
        : null,
    lastSessionSummary:
      rawProgress.lastSessionSummary && typeof rawProgress.lastSessionSummary === 'object'
        ? (rawProgress.lastSessionSummary as ModuleSessionSummary)
        : null,
    completedAt
  } satisfies ModuleProgress
}

function normalizeAll(rawList: unknown): ModuleProgress[] {
  const defaultProgress = createDefaultProgress()

  if (!Array.isArray(rawList)) return defaultProgress

  return gameModules.map((module, index) => {
    const current = rawList.find((item) => {
      if (!item || typeof item !== 'object') return false
      return (item as { moduleId?: string }).moduleId === module.id
    })

    if (!current || typeof current !== 'object') {
      return defaultProgress[index]!
    }

    return normalizeProgress(current as Partial<ModuleProgress> & Record<string, unknown>, index, module)
  })
}

function getDateKey() {
  return new Date().toISOString().slice(0, 10)
}

export const moduleProgressService = {
  getAll(): ModuleProgress[] {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      const defaults = createDefaultProgress()
      this.saveAll(defaults)
      return defaults
    }

    try {
      const parsed = JSON.parse(raw) as unknown
      const normalized = normalizeAll(parsed)
      this.saveAll(normalized)
      return normalized
    } catch {
      const defaults = createDefaultProgress()
      this.saveAll(defaults)
      return defaults
    }
  },

  saveAll(progress: ModuleProgress[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  },

  getByModule(moduleId: ModuleId): ModuleProgress | null {
    return this.getAll().find((item) => item.moduleId === moduleId) ?? null
  },

  getOverview() {
    const progress = this.getAll()
    const completedModules = progress.filter((module) => module.completedAt).length
    const unlockedModules = progress.filter((module) => module.unlocked).length
    const totalStars = progress.reduce((sum, module) => sum + module.earnedStars, 0)

    return {
      completedModules,
      unlockedModules,
      totalStars,
      averageAccuracy:
        progress.reduce((sum, module) => sum + module.bestAccuracy, 0) / Math.max(progress.length, 1)
    }
  },

  createOrResumeSession(moduleId: ModuleId, playerSeed: string) {
    const progressList = this.getAll()
    const progressIndex = progressList.findIndex((item) => item.moduleId === moduleId)
    const currentProgress = progressList[progressIndex]
    if (!currentProgress || !currentProgress.unlocked) return null

    if (currentProgress.activeSession && !currentProgress.activeSession.completedAt) {
      return currentProgress.activeSession
    }

    const session = moduleQuizService.createSession(moduleId, currentProgress, playerSeed)
    if (!session) return null

    currentProgress.activeSession = session
    progressList[progressIndex] = currentProgress
    this.saveAll(progressList)
    return session
  },

  saveAnswer(moduleId: ModuleId, answerRecord: QuizAnswerRecord) {
    const progressList = this.getAll()
    const progressIndex = progressList.findIndex((item) => item.moduleId === moduleId)
    const currentProgress = progressList[progressIndex]
    if (!currentProgress?.activeSession) return null

    const session = currentProgress.activeSession
    const alreadyAnswered = session.answers.some((answer) => answer.questionId === answerRecord.questionId)
    if (alreadyAnswered) return session

    session.answers.push(answerRecord)
    session.currentQuestionIndex = Math.min(session.questionIds.length - 1, session.answers.length)
    currentProgress.activeSession = session
    progressList[progressIndex] = currentProgress
    this.saveAll(progressList)
    return session
  },

  completeSession(moduleId: ModuleId) {
    const progressList = this.getAll()
    const progressIndex = progressList.findIndex((item) => item.moduleId === moduleId)
    const currentProgress = progressList[progressIndex]
    const moduleConfig = gameModules.find((module) => module.id === moduleId)

    if (!currentProgress?.activeSession || !moduleConfig) return null

    const session = currentProgress.activeSession
    const totalQuestions = session.questionIds.length
    const correctAnswers = session.answers.filter((answer) => answer.isCorrect).length
    const starsEarned = session.answers.reduce((sum, answer) => sum + answer.starsEarned, 0)
    const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0
    const advancedDay = session.mode === 'daily' && accuracy >= 0.75

    currentProgress.sessionsCompleted += 1
    currentProgress.totalAnswered += totalQuestions
    currentProgress.totalCorrect += correctAnswers
    currentProgress.bestAccuracy = Math.max(currentProgress.bestAccuracy, accuracy)
    currentProgress.earnedStars += starsEarned
    currentProgress.lastPlayedOn = getDateKey()
    currentProgress.recentQuestionIds = uniqueTail(
      [...currentProgress.recentQuestionIds, ...session.questionIds],
      moduleQuizService.getReviewMemoryLimit(),
    )

    const correctIds = session.answers.filter((answer) => answer.isCorrect).map((answer) => answer.questionId)
    const wrongIds = session.answers.filter((answer) => !answer.isCorrect).map((answer) => answer.questionId)

    currentProgress.masteredQuestionIds = uniqueTail(
      [...currentProgress.masteredQuestionIds, ...correctIds],
      60,
    )
    currentProgress.reviewQuestionIds = uniqueTail(
      [...currentProgress.reviewQuestionIds.filter((id) => !correctIds.includes(id)), ...wrongIds],
      60,
    )

    if (session.mode === 'daily') {
      currentProgress.currentStreak = advancedDay ? currentProgress.currentStreak + 1 : 0
      if (advancedDay) {
        currentProgress.completedDays = Math.max(currentProgress.completedDays, session.day)
      }
    }

    let unlockedModuleId: ModuleId | null = null
    const completedModule = currentProgress.completedDays >= moduleConfig.totalDays
    let firstCompletion = false

    if (completedModule && !currentProgress.completedAt) {
      firstCompletion = true
      currentProgress.completedAt = new Date().toISOString()
      const nextModule = progressList[progressIndex + 1]

      if (nextModule && !nextModule.unlocked) {
        nextModule.unlocked = true
        unlockedModuleId = nextModule.moduleId
        progressList[progressIndex + 1] = nextModule
      }
    }

    session.completedAt = new Date().toISOString()

    const summary: ModuleSessionSummary = {
      moduleId,
      day: session.day,
      mode: session.mode,
      totalQuestions,
      correctAnswers,
      accuracy,
      starsEarned,
      advancedDay,
      nextDay: completedModule ? moduleConfig.totalDays : Math.min(currentProgress.completedDays + 1, moduleConfig.totalDays),
      completedModule,
      firstCompletion,
      unlockedModuleId,
      completedAt: session.completedAt
    }

    currentProgress.lastSessionSummary = summary
    currentProgress.activeSession = null
    progressList[progressIndex] = currentProgress
    this.saveAll(progressList)

    return summary
  },

  reset() {
    this.saveAll(createDefaultProgress())
  },

  getSessionQuestions(moduleId: ModuleId) {
    const progress = this.getByModule(moduleId)
    const session = progress?.activeSession
    if (!session) return []

    return session.questionIds
      .map((questionId) => moduleQuizService.getQuestion(questionId))
      .filter((question): question is ModuleQuestion => question !== null)
  }
}
