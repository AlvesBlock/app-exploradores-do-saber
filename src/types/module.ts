export type ModuleId = 'math' | 'science' | 'geography' | 'language'

export type QuizSessionMode = 'daily' | 'review'
export type QuestionDifficulty = 'warmup' | 'core' | 'challenge'

export interface GameModule {
  id: ModuleId
  title: string
  emoji: string
  mascotEmoji: string
  description: string
  worldLabel: string
  rewardLabel: string
  totalDays: number
  sessionQuestionCount: number
  color: string
  gradient: string
  learningMoments: string[]
}

export interface AnswerOption {
  label: string
  value: string | number
  emoji?: string
  helperText?: string
}

export interface ModuleQuestion {
  id: string
  moduleId: ModuleId
  day: number
  difficulty: QuestionDifficulty
  emoji: string
  title: string
  prompt: string
  tip: string
  options: AnswerOption[]
  correctAnswer: string | number
  successMessage: string
  errorMessage: string
  explanation: string
  rewardStars: number
}

export interface QuizAnswerRecord {
  questionId: string
  selectedAnswer: string | number
  correctAnswer: string | number
  isCorrect: boolean
  starsEarned: number
  answeredAt: string
}

export interface ModuleQuizSession {
  sessionId: string
  moduleId: ModuleId
  mode: QuizSessionMode
  day: number
  questionIds: string[]
  currentQuestionIndex: number
  startedAt: string
  completedAt: string | null
  answers: QuizAnswerRecord[]
}

export interface ModuleSessionSummary {
  moduleId: ModuleId
  day: number
  mode: QuizSessionMode
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  starsEarned: number
  advancedDay: boolean
  nextDay: number
  completedModule: boolean
  unlockedModuleId: ModuleId | null
  completedAt: string
}

export interface ModuleProgress {
  moduleId: ModuleId
  unlocked: boolean
  completedDays: number
  earnedStars: number
  sessionsCompleted: number
  totalAnswered: number
  totalCorrect: number
  bestAccuracy: number
  currentStreak: number
  lastPlayedOn: string | null
  masteredQuestionIds: string[]
  reviewQuestionIds: string[]
  recentQuestionIds: string[]
  activeSession: ModuleQuizSession | null
  lastSessionSummary: ModuleSessionSummary | null
  completedAt: string | null
}

