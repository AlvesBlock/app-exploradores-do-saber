<template>
  <div class="kids-page">
    <div v-if="moduleData" class="kids-container module-shell">
      <section class="kids-card module-hero" :style="{ '--module-gradient': moduleData.gradient }">
        <div class="hero-top">
          <div class="hero-title-block">
            <div class="kids-eyebrow">{{ moduleData.worldLabel }}</div>
            <div class="hero-title-row">
              <span class="hero-module-emoji">{{ moduleData.emoji }}</span>
              <div>
                <h1 class="kids-title">{{ moduleData.title }}</h1>
                <p class="kids-subtitle">{{ moduleData.description }}</p>
              </div>
            </div>
          </div>

          <div class="hero-meta">
            <div class="kids-chip info">Plano de 5 dias</div>
            <div class="kids-chip success">⭐ {{ moduleProgress?.earnedStars ?? 0 }} estrelas</div>
          </div>
        </div>

        <div class="hero-progress">
          <div class="hero-progress-row">
            <span>Progresso do modulo</span>
            <span>Dia {{ displayDay }}/{{ moduleData.totalDays }}</span>
          </div>
          <div class="kids-progress-bar">
            <div class="kids-progress-fill" :style="{ width: `${moduleProgressPercent}%` }"></div>
          </div>
        </div>
      </section>

      <section v-if="screenState === 'locked'" class="kids-card state-card">
        <div class="state-icon">🔒</div>
        <h2>Modulo bloqueado</h2>
        <p>
          Termine o mundo anterior para liberar esta trilha. Isso ajuda a manter a jornada clara e
          divertida.
        </p>
        <div class="state-actions">
          <Button label="Voltar ao hub" icon="pi pi-home" @click="goHub" />
        </div>
      </section>

      <section v-else-if="screenState === 'intro'" class="kids-card state-card intro-card">
        <div class="intro-grid">
          <div class="intro-copy">
            <div class="kids-chip warning">{{ currentMissionLabel }}</div>
            <h2>Missao do dia</h2>
            <p>
              Responda {{ moduleData.sessionQuestionCount }} perguntas curtas com apoio visual.
              Para subir de dia, acerte pelo menos 3 respostas.
            </p>

            <ul>
              <li v-for="goal in moduleData.learningMoments" :key="goal">{{ goal }}</li>
            </ul>
          </div>

          <div v-if="moduleProgress?.lastSessionSummary" class="resume-card">
            <strong>Ultima sessao</strong>
            <span>
              {{ moduleProgress.lastSessionSummary.correctAnswers }}/{{
                moduleProgress.lastSessionSummary.totalQuestions
              }}
              corretas
            </span>
            <small>
              {{
                moduleProgress.lastSessionSummary.advancedDay
                  ? 'Dia concluido. Pode avancar.'
                  : 'Voce pode repetir com novas perguntas.'
              }}
            </small>
          </div>
        </div>

        <div class="state-actions">
          <Button label="Voltar ao hub" icon="pi pi-arrow-left" severity="secondary" outlined @click="goHub" />
          <Button
            :label="resumeLabel"
            icon="pi pi-play"
            @click="startSession"
          />
        </div>
      </section>

      <section v-else-if="screenState === 'question' && displayedQuestion" class="question-shell">
        <article class="kids-card question-card">
          <div class="question-meta">
            <span class="kids-chip info">Pergunta {{ displayedQuestionNumber }}/{{ totalQuestions }}</span>
            <span class="kids-chip neutral">{{ displayedQuestion.difficulty }}</span>
          </div>

          <div class="question-body">
            <div class="question-badge">{{ displayedQuestion.emoji }}</div>
            <h2>{{ displayedQuestion.title }}</h2>
            <p class="question-prompt">{{ displayedQuestion.prompt }}</p>
            <p class="question-tip">Dica: {{ displayedQuestion.tip }}</p>
          </div>

          <div class="question-options">
            <QuizOptionCard
              v-for="option in displayedQuestion.options"
              :key="String(option.value)"
              :option="option"
              :state="getOptionState(option.value)"
              :disabled="questionResolved"
              @click="pickAnswer(option.value)"
            />
          </div>

          <div v-if="lastResult" class="feedback-panel" :class="lastResult.isCorrect ? 'positive' : 'negative'">
            <strong>{{ lastResult.message }}</strong>
            <p>{{ lastResult.explanation }}</p>
            <small v-if="lastResult.isCorrect">+{{ lastResult.starsEarned }} estrela(s) nesta resposta</small>
          </div>

          <div class="state-actions">
            <Button label="Voltar ao hub" icon="pi pi-home" severity="secondary" outlined @click="goHub" />
            <Button
              :label="questionResolved ? continueLabel : 'Responder'"
              icon="pi pi-check"
              :disabled="!questionResolved && selectedAnswer === null"
              @click="questionResolved ? advanceAfterFeedback() : submitAnswer()"
            />
          </div>
        </article>
      </section>

      <section v-else-if="screenState === 'summary' && sessionSummary" class="kids-card state-card summary-card">
        <div class="state-icon">🌟</div>
        <h2>{{ sessionSummary.advancedDay ? 'Dia concluido!' : 'Vamos tentar mais uma vez!' }}</h2>
        <p>
          Voce acertou {{ sessionSummary.correctAnswers }} de
          {{ sessionSummary.totalQuestions }} perguntas e ganhou
          {{ sessionSummary.starsEarned }} estrela(s).
        </p>

        <div class="summary-metrics">
          <div class="kids-stat-pill"><span>🎯</span><span>{{ Math.round(sessionSummary.accuracy * 100) }}%</span></div>
          <div class="kids-stat-pill"><span>📅</span><span>Proximo dia: {{ sessionSummary.nextDay }}</span></div>
        </div>

        <div class="state-actions">
          <Button label="Voltar ao hub" icon="pi pi-home" severity="secondary" outlined @click="goHub" />
          <Button
            :label="sessionSummary.advancedDay ? `Ir para o dia ${sessionSummary.nextDay}` : 'Repetir este dia'"
            icon="pi pi-play"
            @click="prepareNextStep"
          />
        </div>
      </section>

      <section
        v-else-if="screenState === 'module-complete' && moduleProgress"
        class="kids-card state-card completion-card"
      >
        <div class="state-icon">🏆</div>
        <div class="kids-chip success">{{ moduleData.rewardLabel }}</div>
        <h2>Modulo concluido com celebracao!</h2>
        <p>
          Parabens! Voce terminou os 5 dias deste mundo e desbloqueou uma conquista real no app.
        </p>

        <div class="summary-metrics">
          <div class="kids-stat-pill"><span>⭐</span><span>{{ moduleProgress.earnedStars }} estrelas</span></div>
          <div class="kids-stat-pill"><span>🎯</span><span>{{ Math.round(moduleProgress.bestAccuracy * 100) }}%</span></div>
          <div class="kids-stat-pill"><span>🔥</span><span>{{ moduleProgress.currentStreak }}</span></div>
        </div>

        <div class="state-actions">
          <Button label="Voltar ao hub" icon="pi pi-home" severity="secondary" outlined @click="goHub" />
          <Button label="Sessao de revisao" icon="pi pi-refresh" @click="startSession" />
        </div>
      </section>
    </div>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

import QuizOptionCard from '@/components/quiz/QuizOptionCard.vue'
import { getModuleById } from '@/data/modules/modules.data'
import { audioService } from '@/services/audio.service'
import { celebrationService } from '@/services/celebration.service'
import { moduleProgressService } from '@/services/moduleProgress.service'
import { moduleQuizService } from '@/services/moduleQuiz.service'
import { playerProfileService } from '@/services/playerProfile.service'
import type { ModuleId, ModuleProgress, ModuleQuestion, ModuleSessionSummary } from '@/types/module'

type ScreenState = 'locked' | 'intro' | 'question' | 'summary' | 'module-complete'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const screenState = ref<ScreenState>('intro')
const moduleProgress = ref<ModuleProgress | null>(null)
const sessionSummary = ref<ModuleSessionSummary | null>(null)
const selectedAnswer = ref<string | number | null>(null)
const questionResolved = ref(false)
const lastResult = ref<ReturnType<typeof moduleQuizService.evaluateAnswer> | null>(null)
const resolvedQuestion = ref<ModuleQuestion | null>(null)

const moduleId = computed(() => route.params.id as ModuleId)
const moduleData = computed(() => getModuleById(moduleId.value))
const activeSession = computed(() => moduleProgress.value?.activeSession ?? null)
const totalQuestions = computed(() => activeSession.value?.questionIds.length ?? 0)
const currentQuestionIndex = computed(() => activeSession.value?.answers.length ?? 0)
const currentQuestionNumber = computed(() => currentQuestionIndex.value + 1)
const displayedQuestionNumber = computed(() =>
  questionResolved.value ? Math.max(1, currentQuestionIndex.value) : currentQuestionNumber.value,
)

const activeQuestion = computed(() => {
  if (!activeSession.value) return null
  const questionId = activeSession.value.questionIds[currentQuestionIndex.value]
  return questionId ? moduleQuizService.getQuestion(questionId) : null
})
const displayedQuestion = computed(() => (questionResolved.value ? resolvedQuestion.value : activeQuestion.value))

const displayDay = computed(() => {
  if (!moduleData.value || !moduleProgress.value) return 1
  if (moduleProgress.value.completedAt) return moduleData.value.totalDays
  return Math.min(moduleProgress.value.completedDays + 1, moduleData.value.totalDays)
})

const moduleProgressPercent = computed(() => {
  if (!moduleData.value || !moduleProgress.value) return 0
  return (moduleProgress.value.completedDays / moduleData.value.totalDays) * 100
})

const currentMissionLabel = computed(() => `Dia ${displayDay.value} de ${moduleData.value?.totalDays ?? 5}`)
const resumeLabel = computed(() => (moduleProgress.value?.activeSession ? 'Continuar sessao' : `Comecar dia ${displayDay.value}`))
const continueLabel = computed(() => {
  const session = activeSession.value
  if (!session) return 'Continuar'
  return session.answers.length >= session.questionIds.length ? 'Ver resultado da sessao' : 'Proxima pergunta'
})

function syncProgress() {
  moduleProgress.value = moduleProgressService.getByModule(moduleId.value)
}

function resolveScreenState() {
  syncProgress()
  sessionSummary.value = moduleProgress.value?.lastSessionSummary ?? null

  if (!moduleProgress.value?.unlocked) {
    screenState.value = 'locked'
    return
  }

  if (moduleProgress.value.activeSession) {
    screenState.value = 'question'
    return
  }

  if (moduleProgress.value.completedAt) {
    screenState.value = 'module-complete'
    return
  }

  screenState.value = 'intro'
}

function resetQuestionState() {
  selectedAnswer.value = null
  questionResolved.value = false
  lastResult.value = null
  resolvedQuestion.value = null
}

function loadModuleState() {
  if (!moduleData.value) {
    router.replace('/hub')
    return
  }

  playerProfileService.touchLastActive()
  resolveScreenState()
  resetQuestionState()
}

function goHub() {
  router.push('/hub')
}

function startSession() {
  audioService.unlock()
  const playerSeed = playerProfileService.get()?.name ?? 'explorador'
  const nextSession = moduleProgressService.createOrResumeSession(moduleId.value, playerSeed)

  if (!nextSession) {
    toast.add({
      severity: 'warn',
      summary: 'Modulo bloqueado',
      detail: 'Complete a etapa anterior para liberar esta jornada.',
      life: 2400
    })
    resolveScreenState()
    return
  }

  syncProgress()
  resetQuestionState()
  screenState.value = 'question'
}

function pickAnswer(value: string | number) {
  if (questionResolved.value) return
  selectedAnswer.value = value
}

function getOptionState(value: string | number) {
  if (!questionResolved.value || !resolvedQuestion.value || !lastResult.value) {
    return selectedAnswer.value === value ? 'selected' : ''
  }

  if (value === resolvedQuestion.value.correctAnswer) return 'correct'
  if (selectedAnswer.value === value && !lastResult.value.isCorrect) return 'wrong'
  return ''
}

function submitAnswer() {
  const question = activeQuestion.value
  if (!question || selectedAnswer.value === null) return

  audioService.unlock()
  resolvedQuestion.value = question
  lastResult.value = moduleQuizService.evaluateAnswer(question, selectedAnswer.value)
  moduleProgressService.saveAnswer(
    moduleId.value,
    moduleQuizService.createAnswerRecord(question, selectedAnswer.value),
  )

  syncProgress()
  questionResolved.value = true

  if (lastResult.value.isCorrect) audioService.playSuccess()
  else audioService.playError()
}

function finishSession() {
  const summary = moduleProgressService.completeSession(moduleId.value)
  if (!summary) return

  playerProfileService.addStars(summary.starsEarned)
  sessionSummary.value = summary
  syncProgress()
  resetQuestionState()

  if (summary.completedModule) {
    if (summary.firstCompletion) {
      celebrationService.fireModuleCompletion()
      audioService.playCelebration()
    } else {
      audioService.playSuccess()
    }
    screenState.value = 'module-complete'
    return
  }

  toast.add({
    severity: summary.advancedDay ? 'success' : 'warn',
    summary: summary.advancedDay ? 'Dia concluido!' : 'Mais uma tentativa',
    detail: summary.advancedDay
      ? `Voce liberou o dia ${summary.nextDay}.`
      : 'Treine mais um pouco para subir de dia.',
    life: 2400
  })

  screenState.value = 'summary'
}

function advanceAfterFeedback() {
  if (!activeSession.value) return

  if (activeSession.value.answers.length >= activeSession.value.questionIds.length) {
    finishSession()
    return
  }

  resetQuestionState()
}

function prepareNextStep() {
  resolveScreenState()
  startSession()
}

watch(moduleId, () => {
  loadModuleState()
})

onMounted(() => {
  loadModuleState()
})
</script>

<style scoped>
.module-shell {
  display: grid;
  gap: 24px;
}

.module-hero,
.state-card,
.question-card {
  padding: 24px;
}

.module-hero {
  display: grid;
  gap: 18px;
  background: var(--module-gradient);
}

.hero-top {
  display: grid;
  gap: 16px;
}

.hero-title-row {
  display: grid;
  gap: 14px;
}

.hero-module-emoji,
.state-icon,
.question-badge {
  width: 72px;
  height: 72px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  font-size: 2.3rem;
  background: rgba(255, 255, 255, 0.9);
}

.hero-meta,
.hero-progress,
.question-meta,
.summary-metrics,
.state-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-progress {
  display: grid;
  gap: 8px;
}

.hero-progress-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-weight: 800;
}

.state-card,
.question-card {
  display: grid;
  gap: 18px;
}

.state-card {
  justify-items: start;
}

.state-card h2,
.question-card h2 {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2.1rem);
}

.state-card p,
.question-prompt,
.question-tip,
.feedback-panel p {
  margin: 0;
  color: var(--kids-muted);
  line-height: 1.55;
}

.intro-grid {
  display: grid;
  gap: 18px;
}

.intro-copy,
.resume-card,
.question-body,
.feedback-panel {
  display: grid;
  gap: 10px;
}

.intro-copy ul {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: #49617a;
}

.resume-card {
  padding: 18px;
  border-radius: 24px;
  background: rgba(248, 250, 252, 0.94);
}

.question-shell {
  display: grid;
}

.question-options {
  display: grid;
  gap: 12px;
}

.feedback-panel {
  padding: 16px 18px;
  border-radius: 22px;
}

.feedback-panel.positive {
  background: #ecfdf5;
}

.feedback-panel.negative {
  background: #fef2f2;
}

.summary-card,
.completion-card {
  text-align: left;
}

@media (min-width: 860px) {
  .hero-top,
  .intro-grid {
    grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);
    align-items: start;
  }

  .hero-title-row {
    grid-template-columns: auto 1fr;
    align-items: start;
  }

  .question-options {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .state-actions {
    justify-content: flex-start;
  }
}
</style>
