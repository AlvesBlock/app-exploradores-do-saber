import { describe, expect, it } from 'vitest'

import { generateMagicGalleryQuizQuestions } from '@/engine/magic-gallery/quiz'
import { magicGalleryContentService } from '@/services/magicGalleryContent.service'

describe('magic gallery quiz generation', () => {
  it('builds a five-question quiz with valid answers and four options', () => {
    const characters = magicGalleryContentService.getFallbackSnapshot().characters
    const questions = generateMagicGalleryQuizQuestions(characters, 'quiz-seed', 5)

    expect(questions).toHaveLength(5)
    expect(new Set(questions.map((question) => question.id)).size).toBe(5)
    expect(questions.every((question) => question.options.length === 4)).toBe(true)
    expect(
      questions.every((question) => question.options.some((option) => option.id === question.correctOptionId)),
    ).toBe(true)
  })
})
