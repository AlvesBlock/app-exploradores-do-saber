import { beforeEach, describe, expect, it } from 'vitest'

import { moduleQuizService } from '@/services/moduleQuiz.service'
import type { ModuleProgress } from '@/types/module'

function createProgress(overrides: Partial<ModuleProgress> = {}): ModuleProgress {
  return {
    moduleId: 'math',
    unlocked: true,
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
    completedAt: null,
    ...overrides
  }
}

describe('moduleQuizService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates a day-1 session with four unique questions', () => {
    const session = moduleQuizService.createSession('math', createProgress(), 'bia-seed')

    expect(session).not.toBeNull()
    expect(session?.questionIds).toHaveLength(4)
    expect(new Set(session?.questionIds).size).toBe(4)

    const days = session?.questionIds.map((questionId) => moduleQuizService.getQuestion(questionId)?.day)
    expect(days?.every((day) => day === 1)).toBe(true)
  })

  it('injects review questions when the current day has fewer than four fresh prompts', () => {
    const session = moduleQuizService.createSession(
      'math',
      createProgress({
        completedDays: 2,
        sessionsCompleted: 3,
        reviewQuestionIds: ['math-vizinho-antes']
      }),
      'bia-seed',
    )

    expect(session?.questionIds).toContain('math-vizinho-antes')
    expect(session?.questionIds).toHaveLength(4)
  })

  it('evaluates answers with message, explanation and stars', () => {
    const question = moduleQuizService.getQuestion('science-ser-vivo')
    expect(question).not.toBeNull()

    const result = moduleQuizService.evaluateAnswer(question!, 'planta')
    expect(result.isCorrect).toBe(true)
    expect(result.starsEarned).toBeGreaterThan(0)
    expect(result.explanation.length).toBeGreaterThan(10)
  })
})

