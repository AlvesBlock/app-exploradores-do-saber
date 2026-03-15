export type ModuleId = 'math' | 'science' | 'geography' | 'language'

export interface GameModule {
  id: ModuleId
  title: string
  emoji: string
  description: string
  totalPhases: number
  color: string
}

export interface ModuleProgress {
  moduleId: ModuleId
  unlocked: boolean
  completedPhases: number
  earnedStars: number
  completedPhaseIds: string[]
}

export interface AnswerOption {
  label: string
  value: string | number
}

export interface PhaseQuestion {
  id: string
  type: 'multiple-choice'
  title: string
  prompt: string
  options: AnswerOption[]
  correctAnswer: string | number
  successMessage: string
  errorMessage: string
  rewardStars: number
}

export interface ModulePhase {
  id: string
  moduleId: ModuleId
  order: number
  title: string
  question: PhaseQuestion
}