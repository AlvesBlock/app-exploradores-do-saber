import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { generateMagicGalleryMemoryDeck, magicGalleryMemoryLevels } from '@/engine/magic-gallery/memory'
import { generateMagicGalleryQuizQuestions } from '@/engine/magic-gallery/quiz'
import { getMagicGalleryUnlockCost } from '@/engine/magic-gallery/rewards'
import { magicGalleryContentService } from '@/services/magicGalleryContent.service'
import { magicGalleryProgressService } from '@/services/magicGalleryProgress.service'
import { moduleProgressService } from '@/services/moduleProgress.service'
import type {
  MagicGalleryContentSnapshot,
  MagicGalleryDailyHighlight,
  MagicGalleryGalleryItem,
  MagicGalleryMemoryCard,
  MagicGalleryMemoryLevelId,
  MagicGalleryMemorySessionSummary,
  MagicGalleryMission,
  MagicGalleryPanelId,
  MagicGalleryProgress,
  MagicGalleryQuizQuestion,
  MagicGalleryQuizSessionSummary,
  MagicGalleryReward,
  MagicGalleryUnlockStatus
} from '@/types/magic-gallery'

interface QuizFeedbackState {
  isCorrect: boolean
  explanation: string
  correctOptionId: string
}

function getDateKey() {
  return new Date().toISOString().slice(0, 10)
}

export function useMagicGallery() {
  const contentSnapshot = ref<MagicGalleryContentSnapshot>(magicGalleryContentService.getFallbackSnapshot())
  const progress = ref<MagicGalleryProgress>(magicGalleryProgressService.get())
  const unlockStatus = ref<MagicGalleryUnlockStatus>(
    magicGalleryProgressService.getUnlockStatus(moduleProgressService.getAll()),
  )
  const contentLoading = ref(true)
  const contentError = ref('')
  const selectedPanel = ref<MagicGalleryPanelId>('home')
  const selectedCharacterId = ref<string | null>(contentSnapshot.value.characters[0]?.id ?? null)
  const dailyHighlight = ref<MagicGalleryDailyHighlight | null>(null)
  const missions = ref<MagicGalleryMission[]>([])
  const lastReward = ref<MagicGalleryReward | null>(null)
  const actionMessage = ref('')

  const memoryLevelId = ref<MagicGalleryMemoryLevelId>('spark')
  const memoryDeck = ref<MagicGalleryMemoryCard[]>([])
  const memoryFlippedIds = ref<string[]>([])
  const memoryMatchedPairIds = ref<string[]>([])
  const memoryMoves = ref(0)
  const memoryBusy = ref(false)
  const memorySummary = ref<MagicGalleryMemorySessionSummary | null>(null)

  const quizQuestions = ref<MagicGalleryQuizQuestion[]>([])
  const currentQuizIndex = ref(0)
  const selectedQuizOptionId = ref<string | null>(null)
  const quizFeedback = ref<QuizFeedbackState | null>(null)
  const quizCorrectAnswers = ref(0)
  const quizSummary = ref<MagicGalleryQuizSessionSummary | null>(null)

  let mismatchTimerId: number | null = null

  const characters = computed(() => contentSnapshot.value.characters)
  const collections = computed(() => contentSnapshot.value.collections)
  const currentQuizQuestion = computed(() => quizQuestions.value[currentQuizIndex.value] ?? null)
  const totalUnlockedCharacters = computed(() => progress.value.unlockedCharacterIds.length)
  const totalCharacters = computed(() => characters.value.length)
  const unlockedCharacters = computed(() =>
    characters.value.filter((character) => progress.value.unlockedCharacterIds.includes(character.id)),
  )
  const recentRewards = computed(() => progress.value.rewardLedger.slice(0, 3))
  const selectedCharacter = computed(
    () => characters.value.find((character) => character.id === selectedCharacterId.value) ?? null,
  )
  const selectedGalleryItem = computed<MagicGalleryGalleryItem | null>(() => {
    const character = selectedCharacter.value
    if (!character) return null

    return {
      characterId: character.id,
      unlocked: progress.value.unlockedCharacterIds.includes(character.id),
      unlockedAt: progress.value.unlockedCharacterIds.includes(character.id) ? progress.value.unlockedAt : null,
      unlockCost: getMagicGalleryUnlockCost(character.rarity)
    }
  })
  const galleryItems = computed<MagicGalleryGalleryItem[]>(() =>
    characters.value.map((character) => ({
      characterId: character.id,
      unlocked: progress.value.unlockedCharacterIds.includes(character.id),
      unlockedAt: progress.value.unlockedCharacterIds.includes(character.id) ? progress.value.unlockedAt : null,
      unlockCost: getMagicGalleryUnlockCost(character.rarity)
    })),
  )
  const galleryByCharacterId = computed(() =>
    new Map(galleryItems.value.map((item) => [item.characterId, item])),
  )
  const dailyCharacter = computed(
    () =>
      characters.value.find((character) => character.id === dailyHighlight.value?.characterId) ?? null,
  )
  const collectionSummaries = computed(() =>
    collections.value.map((collection) => {
      const collectionCharacters = characters.value.filter(
        (character) => character.collectionId === collection.id,
      )
      const unlockedCount = collectionCharacters.filter((character) =>
        progress.value.unlockedCharacterIds.includes(character.id),
      ).length

      return {
        ...collection,
        totalItems: collectionCharacters.length,
        unlockedItems: unlockedCount,
        progressPercent:
          collectionCharacters.length > 0 ? (unlockedCount / collectionCharacters.length) * 100 : 0
      }
    }),
  )
  const dashboardSummary = computed(() => ({
    magicDust: progress.value.magicDust,
    bonusStars: progress.value.bonusStarsEarned,
    unlockedCharacters: totalUnlockedCharacters.value,
    totalCharacters: totalCharacters.value,
    missionsClaimedToday: missions.value.filter((mission) => !!mission.claimedAt).length,
    completionPercent: totalCharacters.value > 0 ? (totalUnlockedCharacters.value / totalCharacters.value) * 100 : 0
  }))
  const contentBadgeLabel = computed(() => {
    switch (contentSnapshot.value.source) {
      case 'api':
        return 'Catalogo ao vivo'
      case 'cache':
        return 'Catalogo em cache'
      case 'fallback':
        return 'Catalogo de seguranca'
    }

    return 'Catalogo de seguranca'
  })
  const memoryPairsTarget = computed(() => {
    const currentLevel = magicGalleryMemoryLevels.find((level) => level.id === memoryLevelId.value)
    return currentLevel?.pairCount ?? 3
  })
  const isMemoryCompleted = computed(
    () =>
      memoryDeck.value.length > 0 &&
      memoryMatchedPairIds.value.length === new Set(memoryDeck.value.map((card) => card.pairId)).size,
  )
  const quizProgressLabel = computed(() =>
    quizQuestions.value.length > 0
      ? `${currentQuizIndex.value + 1}/${quizQuestions.value.length}`
      : '0/0',
  )

  function clearMismatchTimer() {
    if (mismatchTimerId === null) return
    window.clearTimeout(mismatchTimerId)
    mismatchTimerId = null
  }

  function refreshProgressState() {
    progress.value = magicGalleryProgressService.get()
    unlockStatus.value = magicGalleryProgressService.getUnlockStatus(moduleProgressService.getAll())
    dailyHighlight.value = magicGalleryProgressService.getDailyHighlight(characters.value)
    missions.value = magicGalleryProgressService.getDailyMissions(characters.value)

    if (!selectedCharacterId.value) {
      selectedCharacterId.value =
        dailyHighlight.value?.characterId ??
        progress.value.unlockedCharacterIds[0] ??
        characters.value[0]?.id ??
        null
    }
  }

  async function load(forceRefresh = false) {
    contentLoading.value = true
    contentError.value = ''

    try {
      contentSnapshot.value = await magicGalleryContentService.getSnapshot(forceRefresh)
      if (magicGalleryProgressService.isUnlocked(moduleProgressService.getAll())) {
        magicGalleryProgressService.markVisited()
      }
      refreshProgressState()
    } catch {
      contentSnapshot.value = magicGalleryContentService.getFallbackSnapshot()
      contentError.value = 'Nao foi possivel atualizar o catalogo agora. O modo seguro foi carregado.'
      refreshProgressState()
    } finally {
      contentLoading.value = false
    }
  }

  function selectPanel(panelId: MagicGalleryPanelId) {
    selectedPanel.value = panelId
  }

  function selectCharacter(characterId: string) {
    selectedCharacterId.value = characterId
    magicGalleryProgressService.addSeenCharacter(characterId)
    progress.value = magicGalleryProgressService.get()
  }

  function refreshMissionsAndDaily() {
    dailyHighlight.value = magicGalleryProgressService.getDailyHighlight(characters.value)
    missions.value = magicGalleryProgressService.getDailyMissions(characters.value)
  }

  function revealDailyHighlight() {
    const result = magicGalleryProgressService.revealDailyHighlight(characters.value)
    refreshProgressState()

    if (!result) {
      return { ok: false, message: 'Nao foi possivel revelar o destaque do dia.' }
    }

    if (result.characterId) {
      selectedCharacterId.value = result.characterId
    }

    if (result.reward) {
      lastReward.value = result.reward
      actionMessage.value = `Voce ganhou ${result.reward.magicDust} poeiras magicas no destaque diario.`
      return { ok: true, reward: result.reward, message: actionMessage.value }
    }

    actionMessage.value = 'O destaque de hoje ja foi revelado.'
    return { ok: true, reward: null, message: actionMessage.value }
  }

  function claimMission(missionId: string) {
    const result = magicGalleryProgressService.claimMission(characters.value, missionId)
    refreshProgressState()

    if (!result.ok || !result.reward) {
      return result
    }

    lastReward.value = result.reward
    actionMessage.value = `Missao concluida! +${result.reward.magicDust} poeiras e +${result.reward.bonusStars} estrelas.`
    return {
      ...result,
      message: actionMessage.value
    }
  }

  function unlockSelectedCharacter() {
    const character = selectedCharacter.value
    if (!character) {
      return { ok: false, message: 'Selecione um personagem para revelar.' }
    }

    const result = magicGalleryProgressService.unlockCharacter(character)
    refreshProgressState()

    if (!result.ok) {
      return result
    }

    actionMessage.value = `${character.name} entrou no seu album por ${result.unlockCost} poeiras magicas.`
    return {
      ...result,
      message: actionMessage.value
    }
  }

  function resolveMemoryPool(levelId: MagicGalleryMemoryLevelId) {
    const pairCount =
      magicGalleryMemoryLevels.find((level) => level.id === levelId)?.pairCount ?? 3

    return unlockedCharacters.value.length >= pairCount ? unlockedCharacters.value : characters.value
  }

  function startMemoryGame(levelId = memoryLevelId.value) {
    clearMismatchTimer()
    memoryLevelId.value = levelId
    memoryDeck.value = generateMagicGalleryMemoryDeck(
      resolveMemoryPool(levelId),
      levelId,
      `${getDateKey()}:${levelId}:${progress.value.memory.sessionsPlayed}`,
    )
    memoryFlippedIds.value = []
    memoryMatchedPairIds.value = []
    memoryMoves.value = 0
    memoryBusy.value = false
    memorySummary.value = null
    selectedPanel.value = 'memory'
  }

  function isMemoryCardVisible(cardId: string, pairId: string) {
    return memoryFlippedIds.value.includes(cardId) || memoryMatchedPairIds.value.includes(pairId)
  }

  function flipMemoryCard(cardId: string) {
    if (memoryBusy.value || memorySummary.value) return

    const card = memoryDeck.value.find((entry) => entry.id === cardId)
    if (!card) return
    if (memoryFlippedIds.value.includes(cardId) || memoryMatchedPairIds.value.includes(card.pairId)) return

    memoryFlippedIds.value = [...memoryFlippedIds.value, cardId]
    if (memoryFlippedIds.value.length < 2) return

    const [firstCardId, secondCardId] = memoryFlippedIds.value
    const firstCard = memoryDeck.value.find((entry) => entry.id === firstCardId)
    const secondCard = memoryDeck.value.find((entry) => entry.id === secondCardId)
    if (!firstCard || !secondCard) return

    memoryMoves.value += 1

    if (firstCard.pairId === secondCard.pairId) {
      memoryMatchedPairIds.value = Array.from(
        new Set([...memoryMatchedPairIds.value, firstCard.pairId]),
      )
      memoryFlippedIds.value = []

      if (memoryMatchedPairIds.value.length === new Set(memoryDeck.value.map((entry) => entry.pairId)).size) {
        const summary = magicGalleryProgressService.recordMemoryWin(memoryLevelId.value, memoryMoves.value)
        memorySummary.value = summary
        lastReward.value = summary.reward
        actionMessage.value = `Memoria vencida! +${summary.reward.magicDust} poeiras magicas.`
        refreshProgressState()
      }

      return
    }

    memoryBusy.value = true
    mismatchTimerId = window.setTimeout(() => {
      memoryFlippedIds.value = []
      memoryBusy.value = false
      mismatchTimerId = null
    }, 650)
  }

  function startQuiz() {
    quizQuestions.value = generateMagicGalleryQuizQuestions(
      characters.value,
      `${getDateKey()}:${progress.value.quiz.sessionsPlayed}`,
    )
    currentQuizIndex.value = 0
    selectedQuizOptionId.value = null
    quizFeedback.value = null
    quizCorrectAnswers.value = 0
    quizSummary.value = null
    selectedPanel.value = 'quiz'
  }

  function selectQuizOption(optionId: string) {
    if (quizFeedback.value) return
    selectedQuizOptionId.value = optionId
  }

  function submitQuizAnswer() {
    const question = currentQuizQuestion.value
    if (!question || !selectedQuizOptionId.value || quizFeedback.value) return

    const isCorrect = selectedQuizOptionId.value === question.correctOptionId
    if (isCorrect) {
      quizCorrectAnswers.value += 1
    }

    quizFeedback.value = {
      isCorrect,
      explanation: question.explanation,
      correctOptionId: question.correctOptionId
    }
  }

  function advanceQuiz() {
    if (!quizFeedback.value) return

    if (currentQuizIndex.value >= quizQuestions.value.length - 1) {
      const summary = magicGalleryProgressService.recordQuizCompletion(
        quizCorrectAnswers.value,
        quizQuestions.value.length,
      )
      quizSummary.value = summary
      lastReward.value = summary.reward
      actionMessage.value = `Quiz encerrado! +${summary.reward.magicDust} poeiras magicas.`
      refreshProgressState()
      return
    }

    currentQuizIndex.value += 1
    selectedQuizOptionId.value = null
    quizFeedback.value = null
  }

  function getQuizOptionState(optionId: string) {
    if (!quizFeedback.value) {
      return selectedQuizOptionId.value === optionId ? 'selected' : ''
    }

    if (optionId === quizFeedback.value.correctOptionId) return 'correct'
    if (selectedQuizOptionId.value === optionId && !quizFeedback.value.isCorrect) return 'wrong'
    return ''
  }

  onMounted(() => {
    void load()
  })

  onBeforeUnmount(() => {
    clearMismatchTimer()
  })

  return {
    actionMessage,
    characters,
    collections,
    collectionSummaries,
    contentBadgeLabel,
    contentError,
    contentLoading,
    currentQuizIndex,
    currentQuizQuestion,
    dailyCharacter,
    dailyHighlight,
    dashboardSummary,
    galleryByCharacterId,
    galleryItems,
    isMemoryCardVisible,
    isMemoryCompleted,
    lastReward,
    load,
    memoryBusy,
    memoryDeck,
    memoryFlippedIds,
    memoryLevelId,
    memoryMatchedPairIds,
    memoryMoves,
    memoryPairsTarget,
    memorySummary,
    missions,
    progress,
    quizFeedback,
    quizProgressLabel,
    quizQuestions,
    quizSummary,
    recentRewards,
    refreshMissionsAndDaily,
    revealDailyHighlight,
    selectCharacter,
    selectedCharacter,
    selectedGalleryItem,
    selectedPanel,
    selectedQuizOptionId,
    selectPanel,
    selectQuizOption,
    startMemoryGame,
    startQuiz,
    submitQuizAnswer,
    totalCharacters,
    totalUnlockedCharacters,
    unlockSelectedCharacter,
    unlockStatus,
    unlockedCharacters,
    flipMemoryCard,
    advanceQuiz,
    claimMission,
    getQuizOptionState
  }
}
