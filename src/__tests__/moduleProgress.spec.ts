import { beforeEach, describe, expect, it } from 'vitest'

import { moduleProgressService } from '@/services/moduleProgress.service'
import { moduleQuizService } from '@/services/moduleQuiz.service'

describe('moduleProgressService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes the first module unlocked and the others locked', () => {
    const progress = moduleProgressService.getAll()

    expect(progress[0]?.unlocked).toBe(true)
    expect(progress.slice(1).every((item) => !item.unlocked)).toBe(true)
  })

  it('advances the current day after a session with 75% accuracy', () => {
    const session = moduleProgressService.createOrResumeSession('math', 'bia-seed')
    expect(session).not.toBeNull()

    session?.questionIds.forEach((questionId, index) => {
      const question = moduleQuizService.getQuestion(questionId)
      expect(question).not.toBeNull()

      const selectedAnswer =
        index < 3 ? question!.correctAnswer : String(question!.correctAnswer) + '-wrong'

      moduleProgressService.saveAnswer(
        'math',
        moduleQuizService.createAnswerRecord(question!, selectedAnswer),
      )
    })

    const summary = moduleProgressService.completeSession('math')
    const progress = moduleProgressService.getByModule('math')

    expect(summary?.advancedDay).toBe(true)
    expect(progress?.completedDays).toBe(1)
    expect(progress?.lastSessionSummary?.correctAnswers).toBe(3)
  })

  it('unlocks the next module on first completion of day five', () => {
    const current = moduleProgressService.getAll()
    current[0] = {
      ...current[0]!,
      completedDays: 4,
      unlocked: true
    }
    moduleProgressService.saveAll(current)

    const session = moduleProgressService.createOrResumeSession('math', 'bia-seed')
    expect(session?.day).toBe(5)

    session?.questionIds.forEach((questionId) => {
      const question = moduleQuizService.getQuestion(questionId)
      moduleProgressService.saveAnswer(
        'math',
        moduleQuizService.createAnswerRecord(question!, question!.correctAnswer),
      )
    })

    const summary = moduleProgressService.completeSession('math')
    const mathProgress = moduleProgressService.getByModule('math')
    const geographyProgress = moduleProgressService.getByModule('geography')

    expect(summary?.completedModule).toBe(true)
    expect(summary?.firstCompletion).toBe(true)
    expect(summary?.unlockedModuleId).toBe('geography')
    expect(mathProgress?.completedAt).not.toBeNull()
    expect(geographyProgress?.unlocked).toBe(true)
  })
})

