export type MagicGalleryFeatureId = 'magic-gallery'

export type MagicGalleryHubStatus =
  | 'locked'
  | 'almost-unlocked'
  | 'just-unlocked'
  | 'available'
  | 'visited'

export type MagicGalleryPanelId = 'home' | 'gallery' | 'memory' | 'quiz' | 'missions'
export type MagicGalleryContentSource = 'api' | 'cache' | 'fallback'
export type MagicGalleryRarity = 'common' | 'rare' | 'epic' | 'legendary'
export type MagicGalleryRewardSource =
  | 'starter-pack'
  | 'daily-highlight'
  | 'memory'
  | 'quiz'
  | 'mission'
  | 'gallery-unlock'
export type MagicGalleryMissionKind =
  | 'reveal-daily'
  | 'complete-memory'
  | 'complete-quiz'
  | 'unlock-gallery-item'
export type MagicGalleryQuizQuestionKind =
  | 'match-character-to-story'
  | 'match-story-to-character'
  | 'match-character-to-collection'
export type MagicGalleryMemoryLevelId = 'spark' | 'portal' | 'castle'

export interface DisneyApiCharacterRecord {
  _id: number
  films: string[]
  shortFilms: string[]
  tvShows: string[]
  videoGames: string[]
  parkAttractions: string[]
  allies: string[]
  enemies: string[]
  name: string
  imageUrl: string
  url: string
}

export interface DisneyApiCharactersResponse {
  data: DisneyApiCharacterRecord[]
}

export interface DisneyApiCharacterResponse {
  data: DisneyApiCharacterRecord
}

export interface MagicGalleryCollection {
  id: string
  title: string
  description: string
  color: string
  gradient: string
  accent: string
}

export interface MagicGalleryCharacterSeed {
  id: string
  externalId: number
  fallbackName: string
  fallbackImageUrl: string
  collectionId: string
  storyTitle: string
  tagline: string
  description: string
  emoji: string
  rarity: MagicGalleryRarity
  themeTags: string[]
}

export interface MagicGalleryCharacter {
  id: string
  externalId: number
  name: string
  imageUrl: string
  collectionId: string
  collectionTitle: string
  storyTitle: string
  tagline: string
  description: string
  emoji: string
  rarity: MagicGalleryRarity
  themeTags: string[]
  sourceTitles: string[]
  allies: string[]
  enemies: string[]
  detailUrl: string
  source: MagicGalleryContentSource
}

export interface MagicGalleryGalleryItem {
  characterId: string
  unlocked: boolean
  unlockedAt: string | null
  unlockCost: number
}

export interface MagicGalleryReward {
  source: MagicGalleryRewardSource
  label: string
  magicDust: number
  bonusStars: number
  unlockCharacterIds: string[]
}

export interface MagicGalleryRewardLedgerEntry {
  id: string
  source: MagicGalleryRewardSource
  label: string
  magicDust: number
  bonusStars: number
  unlockCharacterIds: string[]
  createdAt: string
}

export interface MagicGalleryMission {
  id: string
  dateKey: string
  kind: MagicGalleryMissionKind
  icon: string
  title: string
  description: string
  target: number
  progress: number
  completed: boolean
  claimedAt: string | null
  reward: MagicGalleryReward
}

export interface MagicGalleryQuizOption {
  id: string
  label: string
  emoji?: string
}

export interface MagicGalleryQuizQuestion {
  id: string
  kind: MagicGalleryQuizQuestionKind
  prompt: string
  supportingText: string
  characterId: string
  options: MagicGalleryQuizOption[]
  correctOptionId: string
  explanation: string
}

export interface MagicGalleryMemoryCard {
  id: string
  pairId: string
  characterId: string
  label: string
  imageUrl: string
  emoji: string
}

export interface MagicGalleryMemoryLevel {
  id: MagicGalleryMemoryLevelId
  title: string
  description: string
  pairCount: number
  rewardDust: number
  bonusStars: number
}

export interface MagicGalleryMemorySessionSummary {
  levelId: MagicGalleryMemoryLevelId
  moves: number
  matches: number
  reward: MagicGalleryReward
  playedAt: string
}

export interface MagicGalleryQuizSessionSummary {
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  reward: MagicGalleryReward
  playedAt: string
}

export interface MagicGalleryUnlockStatus {
  featureId: MagicGalleryFeatureId
  status: MagicGalleryHubStatus
  totalRequiredModules: number
  completedRequiredModules: number
  remainingModules: number
  progressPercent: number
  unlocked: boolean
  unlockedAt: string | null
  celebrationPending: boolean
  hasVisited: boolean
  requirementText: string
  helperText: string
  ctaLabel: string
}

export interface MagicGalleryDailyHighlight {
  dateKey: string
  characterId: string
  revealed: boolean
  rewardClaimed: boolean
  reward: MagicGalleryReward
}

export interface MagicGalleryActivityCounters {
  dailyRevealCount: number
  memoryWins: number
  quizzesCompleted: number
  galleryUnlocks: number
}

export interface MagicGalleryProgress {
  featureId: MagicGalleryFeatureId
  unlockedAt: string | null
  unlockCelebrationSeenAt: string | null
  firstVisitedAt: string | null
  lastVisitedAt: string | null
  magicDust: number
  bonusStarsEarned: number
  unlockedCharacterIds: string[]
  seenCharacterIds: string[]
  rewardLedger: MagicGalleryRewardLedgerEntry[]
  memory: {
    sessionsPlayed: number
    bestMoves: number | null
    completedLevelIds: MagicGalleryMemoryLevelId[]
    lastPlayedAt: string | null
  }
  quiz: {
    sessionsPlayed: number
    bestScore: number
    lastScore: number
    currentStreak: number
    lastPlayedOn: string | null
  }
  missions: {
    dateKey: string | null
    counters: MagicGalleryActivityCounters
    claims: string[]
  }
  dailyHighlight: {
    dateKey: string | null
    characterId: string | null
    revealedOn: string | null
    rewardClaimedDateKeys: string[]
  }
}

export interface MagicGalleryContentSnapshot {
  source: MagicGalleryContentSource
  updatedAt: string
  characters: MagicGalleryCharacter[]
  collections: MagicGalleryCollection[]
}

export interface MagicGalleryModuleState {
  unlock: MagicGalleryUnlockStatus
  content: MagicGalleryContentSnapshot
  progress: MagicGalleryProgress
  dailyHighlight: MagicGalleryDailyHighlight | null
}
