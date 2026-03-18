<template>
  <div class="kids-page">
    <div class="kids-container premium-shell">
      <section v-if="!unlockStatus.unlocked" class="kids-card locked-card">
        <div class="kids-chip warning">Espaco Plus bloqueado</div>
        <h1 class="kids-title">A Galeria Encantada ainda nao foi liberada.</h1>
        <p class="kids-subtitle">Conclua todos os mundos principais para abrir o portal premium.</p>
        <Button label="Voltar ao Hub" icon="pi pi-home" @click="goHub" />
      </section>

      <template v-else>
        <section class="kids-card hero-card">
          <div class="hero-copy">
            <div class="hero-badges">
              <span class="plus-pill">PLUS</span>
              <span class="kids-chip info">{{ contentBadgeLabel }}</span>
            </div>
            <div class="kids-eyebrow">Portal premium de descoberta</div>
            <h1 class="kids-title">Galeria Encantada</h1>
            <p class="kids-subtitle">
              Revele personagens, jogue memoria, responda o quiz e complete missoes para ganhar
              poeira magica.
            </p>
            <div class="hero-actions">
              <div class="premium-topbar">
                <div class="premium-topbar sticky-topbar">
                  <Button
                    label="Hub"
                    icon="pi pi-home"
                    severity="secondary"
                    outlined
                    @click="goHub"
                  />
                </div>
              </div>
              <Button label="Album" icon="pi pi-images" @click="selectPanel('gallery')" />
              <Button
                label="Memoria"
                icon="pi pi-th-large"
                severity="secondary"
                outlined
                @click="startMemoryPanel"
              />
              <Button
                label="Quiz"
                icon="pi pi-question-circle"
                severity="secondary"
                outlined
                @click="startQuizPanel"
              />
            </div>
          </div>

          <div class="hero-side">
            <div class="summary-grid">
              <div class="summary-card">
                <span>✨</span><strong>{{ dashboardSummary.magicDust }}</strong
                ><small>poeira magica</small>
              </div>
              <div class="summary-card">
                <span>🖼️</span
                ><strong
                  >{{ dashboardSummary.unlockedCharacters }}/{{
                    dashboardSummary.totalCharacters
                  }}</strong
                ><small>figurinhas</small>
              </div>
              <div class="summary-card">
                <span>⭐</span><strong>{{ dashboardSummary.bonusStars }}</strong
                ><small>estrelas bonus</small>
              </div>
              <div class="summary-card">
                <span>🎯</span
                ><strong>{{ missions.filter((mission) => !!mission.claimedAt).length }}</strong
                ><small>missoes resgatadas</small>
              </div>
            </div>

            <div class="kids-card daily-card">
              <div class="daily-top">
                <div>
                  <div class="kids-chip warning">Destaque diario</div>
                  <h2>{{ dailyCharacter?.name ?? 'Personagem misterioso' }}</h2>
                </div>
                <div class="daily-mark">✨</div>
              </div>

              <div v-if="dailyCharacter && dailyHighlight?.revealed" class="daily-revealed">
                <img
                  :src="dailyCharacter.imageUrl"
                  :alt="dailyCharacter.name"
                  class="daily-image"
                />
                <p>{{ dailyCharacter.tagline }}</p>
              </div>

              <div v-else class="daily-hidden">
                <div class="daily-placeholder">🌟</div>
                <p>Revele o personagem misterioso de hoje para ganhar bonus premium.</p>
              </div>

              <Button
                :label="dailyHighlight?.revealed ? 'Ver no album' : 'Revelar destaque'"
                :icon="dailyHighlight?.revealed ? 'pi pi-images' : 'pi pi-star'"
                @click="dailyHighlight?.revealed ? openDailyCharacter() : revealHighlight()"
              />
            </div>
          </div>
        </section>

        <section class="panel-nav">
          <button
            v-for="panel in panels"
            :key="panel.id"
            type="button"
            class="panel-button"
            :class="{ active: selectedPanel === panel.id }"
            @click="selectPanel(panel.id)"
          >
            <span>{{ panel.emoji }}</span>
            <strong>{{ panel.label }}</strong>
          </button>
        </section>

        <section v-if="contentError" class="kids-card notice-card">
          <p>{{ contentError }}</p>
          <Button
            label="Atualizar catalogo"
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            @click="refreshCatalog"
          />
        </section>

        <section v-if="selectedPanel === 'home'" class="panel-shell home-grid">
          <article class="kids-card panel-card">
            <div class="panel-header">
              <div>
                <div class="kids-eyebrow">Colecoes</div>
                <h2 class="kids-section-title">Progresso do album</h2>
              </div>
              <Button
                label="Abrir album"
                icon="pi pi-images"
                severity="secondary"
                outlined
                @click="selectPanel('gallery')"
              />
            </div>
            <div class="collection-grid">
              <div
                v-for="collection in collectionSummaries"
                :key="collection.id"
                class="collection-card"
                :style="{ '--collection-gradient': collection.gradient }"
              >
                <strong>{{ collection.title }}</strong>
                <p>{{ collection.unlockedItems }}/{{ collection.totalItems }} itens</p>
                <div class="kids-progress-bar">
                  <div
                    class="kids-progress-fill collection-fill"
                    :style="{ width: `${collection.progressPercent}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </article>

          <article class="kids-card panel-card">
            <div class="panel-header">
              <div>
                <div class="kids-eyebrow">Missoes</div>
                <h2 class="kids-section-title">Objetivos do dia</h2>
              </div>
              <Button
                label="Ver missoes"
                icon="pi pi-flag"
                severity="secondary"
                outlined
                @click="selectPanel('missions')"
              />
            </div>
            <div class="mini-mission-list">
              <div
                v-for="mission in missions.slice(0, 4)"
                :key="mission.id"
                class="mini-mission-card"
              >
                <div>
                  <span>{{ mission.icon }}</span
                  ><strong>{{ mission.title }}</strong>
                </div>
                <small>{{ mission.progress }}/{{ mission.target }}</small>
              </div>
            </div>
          </article>
        </section>

        <section v-else-if="selectedPanel === 'gallery'" class="panel-shell gallery-layout">
          <div class="album-grid">
            <MagicGalleryAlbumCard
              v-for="character in characters"
              :key="character.id"
              :character="character"
              :item="galleryByCharacterId.get(character.id)!"
              :selected="selectedCharacter?.id === character.id"
              :collection-gradient="getCollectionGradient(character.collectionId)"
              @select="selectCharacter(character.id)"
            />
          </div>

          <aside v-if="selectedCharacter && selectedGalleryItem" class="kids-card detail-card">
            <div
              class="detail-media"
              :style="{
                '--detail-gradient': getCollectionGradient(selectedCharacter.collectionId),
              }"
            >
              <img
                v-if="selectedGalleryItem.unlocked"
                :src="selectedCharacter.imageUrl"
                :alt="selectedCharacter.name"
              />
              <div v-else class="detail-placeholder">{{ selectedCharacter.emoji }}</div>
            </div>
            <div class="detail-copy">
              <div class="detail-badges">
                <span class="kids-chip info">{{ selectedCharacter.collectionTitle }}</span>
                <span class="kids-chip warning">{{ selectedCharacter.rarity }}</span>
              </div>
              <h3>
                {{ selectedGalleryItem.unlocked ? selectedCharacter.name : 'Figurinha misteriosa' }}
              </h3>
              <p>{{ selectedCharacter.description }}</p>
              <small>{{ selectedCharacter.storyTitle }}</small>
              <Button
                v-if="!selectedGalleryItem.unlocked"
                :label="`Revelar por ${selectedGalleryItem.unlockCost}`"
                icon="pi pi-unlock"
                @click="unlockCharacterCard"
              />
            </div>
          </aside>
        </section>

        <section v-else-if="selectedPanel === 'memory'" class="panel-shell">
          <div class="panel-header">
            <div>
              <div class="kids-eyebrow">Memoria encantada</div>
              <h2 class="kids-section-title">Combine pares brilhantes</h2>
            </div>
            <div class="level-row">
              <button
                v-for="level in memoryLevels"
                :key="level.id"
                type="button"
                class="level-button"
                :class="{ active: memoryLevelId === level.id }"
                @click="startMemoryGame(level.id)"
              >
                {{ level.title }}
              </button>
            </div>
          </div>

          <div class="memory-grid" :style="{ '--memory-columns': memoryGridColumns }">
            <button
              v-for="card in memoryDeck"
              :key="card.id"
              type="button"
              class="memory-card"
              :class="{
                visible: isMemoryCardVisible(card.id, card.pairId),
                matched: memoryMatchedPairIds.includes(card.pairId),
              }"
              @click="flipMemoryCard(card.id)"
            >
              <div class="memory-face front">{{ card.emoji }}</div>
              <div class="memory-face back">
                <img :src="card.imageUrl" :alt="card.label" />
                <strong>{{ card.label }}</strong>
              </div>
            </button>
          </div>

          <article v-if="memorySummary" class="kids-card result-card">
            <h3>Memoria vencida em {{ memorySummary.moves }} movimentos.</h3>
            <p>Bonus recebido: {{ memorySummary.reward.magicDust }} poeiras magicas.</p>
            <Button
              label="Jogar novamente"
              icon="pi pi-refresh"
              @click="startMemoryGame(memoryLevelId)"
            />
          </article>
        </section>

        <section v-else-if="selectedPanel === 'quiz'" class="panel-shell">
          <article v-if="quizSummary" class="kids-card result-card">
            <h3>
              Quiz concluido com {{ quizSummary.correctAnswers }}/{{ quizSummary.totalQuestions }}.
            </h3>
            <p>Recompensa: {{ quizSummary.reward.magicDust }} poeiras magicas.</p>
            <Button label="Novo quiz" icon="pi pi-refresh" @click="startQuiz" />
          </article>

          <article v-else-if="currentQuizQuestion" class="kids-card panel-card">
            <div class="panel-header">
              <div>
                <div class="kids-eyebrow">Quiz</div>
                <h2 class="kids-section-title">{{ currentQuizQuestion.prompt }}</h2>
              </div>
              <div class="kids-stat-pill">
                <span>❓</span><span>{{ quizProgressLabel }}</span>
              </div>
            </div>

            <p class="quiz-support">{{ currentQuizQuestion.supportingText }}</p>

            <div class="quiz-options">
              <button
                v-for="option in currentQuizQuestion.options"
                :key="option.id"
                type="button"
                class="quiz-option"
                :class="getQuizOptionState(option.id)"
                @click="selectQuizOption(option.id)"
              >
                <span>{{ option.emoji ?? '✨' }}</span>
                <strong>{{ option.label }}</strong>
              </button>
            </div>

            <div
              v-if="quizFeedback"
              class="quiz-feedback"
              :class="quizFeedback.isCorrect ? 'positive' : 'negative'"
            >
              <strong>{{ quizFeedback.isCorrect ? 'Resposta certa!' : 'Quase la!' }}</strong>
              <p>{{ quizFeedback.explanation }}</p>
            </div>

            <div class="state-actions">
              <Button
                v-if="!quizFeedback"
                label="Responder"
                icon="pi pi-check"
                :disabled="!selectedQuizOptionId"
                @click="submitQuizAnswer"
              />
              <Button
                v-else
                :label="
                  currentQuizIndex + 1 >= quizQuestions.length
                    ? 'Ver recompensa'
                    : 'Proxima pergunta'
                "
                icon="pi pi-arrow-right"
                @click="advanceQuiz"
              />
            </div>
          </article>
        </section>

        <section v-else-if="selectedPanel === 'missions'" class="panel-shell missions-grid">
          <MagicGalleryMissionCard
            v-for="mission in missions"
            :key="mission.id"
            :mission="mission"
            @claim="claimMissionReward"
          />
        </section>
      </template>
    </div>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

import MagicGalleryAlbumCard from '@/components/magic-gallery/MagicGalleryAlbumCard.vue'
import MagicGalleryMissionCard from '@/components/magic-gallery/MagicGalleryMissionCard.vue'
import { useMagicGallery } from '@/composables/useMagicGallery'
import { magicGalleryMemoryLevels } from '@/engine/magic-gallery/memory'
import type { MagicGalleryPanelId } from '@/types/magic-gallery'

const router = useRouter()
const toast = useToast()

const {
  advanceQuiz,
  claimMission,
  collectionSummaries,
  collections,
  contentBadgeLabel,
  contentError,
  currentQuizIndex,
  currentQuizQuestion,
  dailyCharacter,
  dailyHighlight,
  dashboardSummary,
  flipMemoryCard,
  galleryByCharacterId,
  getQuizOptionState,
  isMemoryCardVisible,
  load,
  memoryDeck,
  memoryLevelId,
  memoryMatchedPairIds,
  memorySummary,
  missions,
  quizFeedback,
  quizProgressLabel,
  quizQuestions,
  quizSummary,
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
  unlockSelectedCharacter,
  unlockStatus,
  characters,
} = useMagicGallery()

const panels: Array<{ id: MagicGalleryPanelId; label: string; emoji: string }> = [
  { id: 'home', label: 'Inicio', emoji: '✨' },
  { id: 'gallery', label: 'Album', emoji: '🖼️' },
  { id: 'memory', label: 'Memoria', emoji: '🧠' },
  { id: 'quiz', label: 'Quiz', emoji: '🔎' },
  { id: 'missions', label: 'Missoes', emoji: '🎯' },
]

const memoryLevels = magicGalleryMemoryLevels
const collectionGradientMap = computed(
  () => new Map(collections.value.map((collection) => [collection.id, collection.gradient])),
)
const memoryGridColumns = computed(() => (memoryDeck.value.length <= 6 ? 3 : 4))

function goHub() {
  router.push('/hub')
}

function notify(message: string, severity: 'success' | 'warn' | 'info' = 'success') {
  toast.add({ severity, summary: 'Galeria Encantada', detail: message, life: 2600 })
}

function startMemoryPanel() {
  startMemoryGame(memoryLevelId.value)
}

function startQuizPanel() {
  startQuiz()
}

function revealHighlight() {
  const result = revealDailyHighlight()
  notify(result.message, result.ok ? 'success' : 'warn')
}

function openDailyCharacter() {
  if (!dailyCharacter.value) return
  selectCharacter(dailyCharacter.value.id)
  selectPanel('gallery')
}

function claimMissionReward(missionId: string) {
  const result = claimMission(missionId)
  notify(result.message ?? 'Nao foi possivel resgatar a missao.', result.ok ? 'success' : 'warn')
}

function unlockCharacterCard() {
  const result = unlockSelectedCharacter()
  notify(result.message ?? 'Nao foi possivel revelar a figurinha.', result.ok ? 'success' : 'warn')
}

async function refreshCatalog() {
  await load(true)
  notify('Catalogo atualizado.', 'info')
}

function getCollectionGradient(collectionId: string) {
  return (
    collectionGradientMap.value.get(collectionId) ??
    'linear-gradient(135deg, #eef2ff 0%, #fff7ed 100%)'
  )
}
</script>

<style scoped>
.premium-shell,
.hero-card,
.hero-copy,
.hero-side,
.daily-card,
.panel-shell,
.panel-card,
.detail-card,
.detail-copy,
.result-card {
  display: grid;
  gap: 18px;
}
.locked-card,
.hero-card,
.panel-card,
.result-card,
.notice-card {
  padding: 24px;
}
.hero-card {
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.96), transparent 30%),
    linear-gradient(
      135deg,
      rgba(37, 99, 235, 0.14) 0%,
      rgba(168, 85, 247, 0.18) 50%,
      rgba(245, 158, 11, 0.18) 100%
    );
}
.hero-badges,
.hero-actions,
.summary-grid,
.panel-header,
.detail-badges,
.level-row,
.state-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.plus-pill {
  display: inline-flex;
  padding: 9px 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, #4338ca 0%, #a855f7 48%, #f59e0b 100%);
  color: #fff;
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}
.summary-grid,
.collection-grid,
.mini-mission-list,
.missions-grid {
  display: grid;
  gap: 14px;
}
.summary-card,
.collection-card,
.mini-mission-card {
  padding: 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.9);
}
.summary-card small,
.collection-card p,
.mini-mission-card small,
.daily-revealed p,
.daily-hidden p,
.detail-copy p,
.quiz-support,
.notice-card p {
  margin: 0;
  color: #5d7288;
  line-height: 1.55;
}
.daily-card {
  padding: 18px;
  background: rgba(255, 255, 255, 0.9);
}
.daily-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.daily-top h2,
.detail-copy h3 {
  margin: 8px 0 0;
}
.daily-mark,
.daily-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #4338ca 0%, #a855f7 50%, #f59e0b 100%);
  color: #fff;
  font-size: 1.8rem;
}
.daily-image,
.detail-media img {
  width: 100%;
  border-radius: 22px;
  object-fit: cover;
}
.panel-nav {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.panel-button,
.level-button,
.quiz-option,
.memory-card {
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.9);
}
.panel-button {
  padding: 14px;
  display: grid;
  gap: 8px;
  text-align: left;
}
.panel-button.active,
.level-button.active {
  background: #eef2ff;
  border-color: rgba(99, 102, 241, 0.3);
}
.home-grid,
.gallery-layout {
  display: grid;
  gap: 18px;
}
.collection-card {
  background: var(--collection-gradient);
}
.collection-fill {
  background: linear-gradient(90deg, #f59e0b 0%, #2563eb 100%);
}
.mini-mission-card div {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}
.album-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.detail-card {
  padding: 18px;
}
.detail-media {
  min-height: 280px;
  border-radius: 24px;
  overflow: hidden;
  background: var(--detail-gradient);
  display: grid;
  place-items: center;
}
.detail-placeholder {
  font-size: 3rem;
}
.memory-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(var(--memory-columns), minmax(0, 1fr));
}
.memory-card {
  position: relative;
  background: transparent;
  aspect-ratio: 0.86;
  border: 0;
  perspective: 900px;
}
.memory-face {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  display: grid;
  place-items: center;
  backface-visibility: hidden;
  transition: transform 0.45s ease;
  overflow: hidden;
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.1);
}
.memory-face.front {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 55%, #f59e0b 100%);
  color: #fff;
  font-size: 1.9rem;
}
.memory-face.back {
  background: #fff;
  transform: rotateY(180deg);
}
.memory-face.back img {
  width: 100%;
  height: calc(100% - 48px);
  object-fit: cover;
}
.memory-face.back strong {
  padding: 10px 12px;
  font-size: 0.92rem;
}
.memory-card.visible .front,
.memory-card.matched .front {
  transform: rotateY(180deg);
}
.memory-card.visible .back,
.memory-card.matched .back {
  transform: rotateY(360deg);
}
.quiz-options {
  display: grid;
  gap: 12px;
}
.quiz-option {
  padding: 16px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
  text-align: left;
}
.quiz-option.selected {
  background: #eff6ff;
}
.quiz-option.correct {
  background: #ecfdf5;
}
.quiz-option.wrong {
  background: #fef2f2;
}
.quiz-feedback {
  padding: 16px;
  border-radius: 22px;
}
.quiz-feedback.positive {
  background: #ecfdf5;
}
.quiz-feedback.negative {
  background: #fef2f2;
}
@media (min-width: 860px) {
  .hero-card,
  .gallery-layout {
    grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  }
  .summary-grid,
  .collection-grid,
  .missions-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .panel-nav {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .home-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .album-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .quiz-options {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1180px) {
  .album-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
