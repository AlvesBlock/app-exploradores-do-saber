<template>
  <section class="stage-selector">
    <header class="selector-header">
      <div>
        <div class="kids-eyebrow">Missoes orbitais</div>
        <h2 class="kids-section-title">Selecione a proxima rota</h2>
      </div>
      <span class="selector-caption">As fases liberadas aparecem primeiro no fluxo.</span>
    </header>

    <div class="stage-rail" aria-label="Seletor de fases">
      <button
        v-for="stage in orderedCards"
        :key="stage.id"
        type="button"
        class="stage-card"
        :class="{
          active: stage.id === selectedStageId,
          locked: !stage.progress.unlocked
        }"
        :style="{ '--stage-gradient': stage.gradient, '--stage-accent': stage.accentColor }"
        @click="$emit('select', stage.id)"
      >
        <div class="stage-card__glow"></div>
        <div class="stage-card__top">
          <div class="stage-card__title">
            <small>{{ stage.badge }}</small>
            <strong>{{ stage.title }}</strong>
          </div>
          <span class="kids-chip" :class="stage.progress.unlocked ? 'success' : 'neutral'">
            {{ stage.progress.unlocked ? `${stage.progress.bestStars || 0}⭐` : 'Bloqueada' }}
          </span>
        </div>

        <p>{{ stage.description }}</p>

        <div class="stage-card__meta">
          <span>Recorde {{ stage.progress.bestScore }}</span>
          <span>{{ stage.progress.attempts }} tentativa(s)</span>
        </div>

        <div class="stage-card__progress">
          <div class="stage-card__progress-track">
            <div
              class="stage-card__progress-fill"
              :style="{ width: `${Math.min(100, (stage.progress.bestStars / 3) * 100)}%` }"
            ></div>
          </div>
          <small>{{ stage.progress.completedAt ? 'Missao concluida' : 'Ainda em exploracao' }}</small>
        </div>
      </button>
    </div>

    <article
      v-if="selectedStage"
      class="stage-focus"
      :style="{ '--focus-gradient': selectedStage.gradient, '--focus-accent': selectedStage.accentColor }"
    >
      <div class="stage-focus__hero">
        <div class="stage-focus__badge">{{ selectedStage.badge }}</div>
        <div class="stage-focus__copy">
          <span class="stage-focus__theme">{{ selectedStage.themeName }}</span>
          <h3>{{ selectedStage.title }}</h3>
          <p>{{ selectedStage.description }}</p>
        </div>
      </div>

      <div class="stage-focus__metrics">
        <div class="stage-focus__metric">
          <span>Recorde</span>
          <strong>{{ selectedStage.progress.bestScore }}</strong>
        </div>
        <div class="stage-focus__metric">
          <span>Melhor combo</span>
          <strong>x{{ Math.max(1, selectedStage.progress.highCombo) }}</strong>
        </div>
        <div class="stage-focus__metric">
          <span>EcoScore</span>
          <strong>{{ selectedStage.progress.bestEcoScore }}</strong>
        </div>
      </div>

      <div class="stage-focus__goals">
        <div class="goal-pill">♻️ {{ selectedStage.goals.collectTarget }} coletas</div>
        <div class="goal-pill">⚠️ {{ selectedStage.goals.neutralizeTarget }} neutralizacoes</div>
        <div class="goal-pill">🛰️ {{ selectedStage.goals.protectTarget }} estruturas</div>
        <div class="goal-pill">🌱 {{ selectedStage.goals.ecoScoreTarget }} ecoScore</div>
      </div>

      <ul class="stage-focus__list">
        <li v-for="mission in selectedStage.missionLines" :key="mission">{{ mission }}</li>
      </ul>

      <footer class="stage-focus__footer">
        <span class="kids-chip info">
          {{ selectedStage.progress.unlocked ? 'Pronta para jogar' : 'Libere a fase anterior primeiro' }}
        </span>
        <Button
          :label="selectedStage.progress.unlocked ? 'Iniciar esta fase' : 'Fase bloqueada'"
          icon="pi pi-play"
          :disabled="!selectedStage.progress.unlocked"
          @click="$emit('start')"
        />
      </footer>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

import type { EcoNaveStageConfig, EcoNaveStageId, EcoNaveStageProgress } from '@/types/econave'

type StageCardViewModel = EcoNaveStageConfig & {
  progress: EcoNaveStageProgress
}

const props = defineProps<{
  stageCards: StageCardViewModel[]
  selectedStageId: EcoNaveStageId
}>()

defineEmits<{
  select: [stageId: EcoNaveStageId]
  start: []
}>()

const orderedCards = computed(() =>
  [...props.stageCards].sort((left, right) => Number(right.progress.unlocked) - Number(left.progress.unlocked) || left.order - right.order),
)

const selectedStage = computed(
  () => props.stageCards.find((stage) => stage.id === props.selectedStageId) ?? props.stageCards[0] ?? null,
)
</script>

<style scoped>
.stage-selector {
  display: grid;
  gap: 18px;
}

.selector-header {
  display: grid;
  gap: 10px;
}

.selector-caption {
  color: rgba(226, 232, 240, 0.76);
  line-height: 1.5;
}

.stage-rail {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(82%, 1fr);
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 4px;
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
}

.stage-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(6, 18, 43, 0.82) 0%, rgba(9, 22, 51, 0.94) 100%);
  padding: 18px;
  text-align: left;
  display: grid;
  gap: 14px;
  min-height: 220px;
  color: #eff6ff;
  box-shadow: 0 18px 42px rgba(2, 6, 23, 0.24);
  scroll-snap-align: start;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
}

.stage-card:hover,
.stage-card:focus-visible {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.24);
  box-shadow: 0 24px 46px rgba(2, 6, 23, 0.3);
}

.stage-card.active {
  border-color: color-mix(in srgb, var(--stage-accent) 68%, white);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--stage-accent) 48%, white),
    0 28px 52px rgba(2, 6, 23, 0.34);
}

.stage-card.locked {
  opacity: 0.74;
}

.stage-card__glow {
  position: absolute;
  inset: auto -14% -30% 30%;
  height: 140px;
  background: var(--stage-gradient);
  filter: blur(28px);
  opacity: 0.42;
  pointer-events: none;
}

.stage-card__top,
.stage-card__meta,
.stage-card__progress,
.stage-focus__footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.stage-card__top,
.stage-card__meta,
.stage-card__progress,
.stage-card p,
.stage-card__title {
  position: relative;
  z-index: 1;
}

.stage-card__title {
  display: grid;
  gap: 8px;
}

.stage-card__title small,
.stage-card__progress small {
  color: rgba(226, 232, 240, 0.76);
}

.stage-card strong {
  font-size: 1.08rem;
}

.stage-card p {
  margin: 0;
  color: rgba(226, 232, 240, 0.92);
  line-height: 1.55;
  min-height: 72px;
}

.stage-card__meta {
  font-weight: 800;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.86);
}

.stage-card__progress {
  align-items: center;
  margin-top: auto;
}

.stage-card__progress-track {
  flex: 1 1 auto;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.14);
}

.stage-card__progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.92) 0%, color-mix(in srgb, var(--stage-accent) 80%, white) 100%);
}

.stage-focus {
  position: relative;
  overflow: hidden;
  border-radius: 30px;
  padding: 20px;
  display: grid;
  gap: 18px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
    linear-gradient(135deg, rgba(2, 6, 23, 0.78) 0%, rgba(9, 22, 51, 0.92) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 24px 52px rgba(2, 6, 23, 0.24);
  color: #f8fbff;
}

.stage-focus::before {
  content: '';
  position: absolute;
  inset: -20% auto auto 52%;
  width: 180px;
  height: 180px;
  background: var(--focus-gradient);
  border-radius: 999px;
  filter: blur(36px);
  opacity: 0.4;
  pointer-events: none;
}

.stage-focus__hero,
.stage-focus__copy {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 10px;
}

.stage-focus__hero {
  gap: 16px;
}

.stage-focus__badge {
  justify-self: start;
  padding: 10px 16px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--focus-accent) 56%, white);
  color: #081120;
  font-weight: 900;
}

.stage-focus__theme {
  color: rgba(226, 232, 240, 0.82);
  font-size: 0.86rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.stage-focus__copy h3,
.stage-focus__copy p {
  margin: 0;
}

.stage-focus__copy h3 {
  font-size: clamp(1.42rem, 3vw, 2rem);
}

.stage-focus__copy p,
.stage-focus__list {
  color: rgba(226, 232, 240, 0.92);
  line-height: 1.6;
}

.stage-focus__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  position: relative;
  z-index: 1;
}

.stage-focus__metric {
  display: grid;
  gap: 6px;
  padding: 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.stage-focus__metric span {
  color: rgba(226, 232, 240, 0.76);
  font-size: 0.82rem;
}

.stage-focus__metric strong {
  font-size: 1.2rem;
}

.stage-focus__goals {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.goal-pill {
  border-radius: 999px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-weight: 800;
}

.stage-focus__list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.stage-focus__footer {
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

@media (min-width: 760px) {
  .selector-header {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }

  .stage-rail {
    grid-auto-columns: minmax(320px, 1fr);
  }

  .stage-focus__hero {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;
  }
}

@media (max-width: 639px) {
  .stage-focus__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
