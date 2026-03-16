import { getModuleById, getQuestionById, getQuestionsByModule } from '@/data/modules/modules.data'
import type {
  ModuleProgress,
  ModuleQuestion,
  ModuleQuizSession,
  QuizAnswerRecord,
  QuizSessionMode
} from '@/types/module'

const REVIEW_MEMORY_LIMIT = 12

function createSeed(seed: string) {
  let hash = 2166136261

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return () => {
    hash += hash << 13
    hash ^= hash >>> 7
    hash += hash << 3
    hash ^= hash >>> 17
    hash += hash << 5

    return ((hash >>> 0) % 1000) / 1000
  }
}

function shuffleWithSeed<T>(items: T[], seed: string) {
  const nextRandom = createSeed(seed)
  const list = [...items]

  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(nextRandom() * (index + 1))
    const currentItem = list[index]!
    list[index] = list[swapIndex]!
    list[swapIndex] = currentItem
  }

  return list
}

function uniqueQuestionIds(questions: ModuleQuestion[]) {
  return Array.from(new Set(questions.map((question) => question.id)))
}

function selectQuestions(
  questions: ModuleQuestion[],
  targetCount: number,
  progress: ModuleProgress,
  seedBase: string,
  day: number,
) {
  const recentSet = new Set(progress.recentQuestionIds)
  const reviewSet = new Set(progress.reviewQuestionIds)
  const masteredSet = new Set(progress.masteredQuestionIds)

  const currentDayQuestions = shuffleWithSeed(
    questions.filter((question) => question.day === day),
    `${seedBase}:current-day`,
  )

  const reviewQuestions = shuffleWithSeed(
    questions.filter((question) => question.day < day && reviewSet.has(question.id)),
    `${seedBase}:review`,
  )

  const freshQuestions = shuffleWithSeed(
    questions.filter(
      (question) =>
        question.day <= day && !recentSet.has(question.id) && !masteredSet.has(question.id),
    ),
    `${seedBase}:fresh`,
  )

  const fallbackQuestions = shuffleWithSeed(
    questions.filter((question) => question.day <= day),
    `${seedBase}:fallback`,
  )

  const merged = [
    ...currentDayQuestions,
    ...reviewQuestions,
    ...freshQuestions,
    ...fallbackQuestions
  ]

  return uniqueQuestionIds(merged).slice(0, targetCount)
}

function dateKey(now: Date) {
  return now.toISOString().slice(0, 10)
}

export const moduleQuizService = {
  getQuestion(questionId: string) {
    return getQuestionById(questionId)
  },

  getQuestionsForModule(moduleId: ModuleProgress['moduleId']) {
    return getQuestionsByModule(moduleId)
  },

  createSession(moduleId: ModuleProgress['moduleId'], progress: ModuleProgress, playerSeed: string) {
    const moduleConfig = getModuleById(moduleId)
    if (!moduleConfig) return null

    const now = new Date()
    const mode: QuizSessionMode =
      progress.completedDays >= moduleConfig.totalDays ? 'review' : 'daily'
    const day =
      mode === 'daily' ? Math.min(progress.completedDays + 1, moduleConfig.totalDays) : moduleConfig.totalDays
    const questions = this.getQuestionsForModule(moduleId)
    const sessionSeed = `${moduleId}:${playerSeed}:${dateKey(now)}:${day}:${mode}:${progress.sessionsCompleted}`
    const questionIds = selectQuestions(
      questions,
      moduleConfig.sessionQuestionCount,
      progress,
      sessionSeed,
      day,
    )

    return {
      sessionId: `${sessionSeed}:${questionIds.join('-')}`,
      moduleId,
      mode,
      day,
      questionIds,
      currentQuestionIndex: 0,
      startedAt: now.toISOString(),
      completedAt: null,
      answers: []
    } satisfies ModuleQuizSession
  },

  evaluateAnswer(question: ModuleQuestion, selectedAnswer: string | number) {
    const isCorrect = selectedAnswer === question.correctAnswer

    return {
      isCorrect,
      message: isCorrect ? question.successMessage : question.errorMessage,
      explanation: question.explanation,
      correctAnswer: question.correctAnswer,
      starsEarned: isCorrect ? question.rewardStars : 0
    }
  },

  createAnswerRecord(question: ModuleQuestion, selectedAnswer: string | number): QuizAnswerRecord {
    const evaluation = this.evaluateAnswer(question, selectedAnswer)

    return {
      questionId: question.id,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect: evaluation.isCorrect,
      starsEarned: evaluation.starsEarned,
      answeredAt: new Date().toISOString()
    }
  },

  getReviewMemoryLimit() {
    return REVIEW_MEMORY_LIMIT
  }
}
