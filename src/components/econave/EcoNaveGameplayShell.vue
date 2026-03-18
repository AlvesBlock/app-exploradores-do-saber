<template>
  <section class="gameplay-shell">
    <div class="gameplay-shell__backdrop"></div>

    <div class="gameplay-shell__viewport">
      <div class="playfield">
        <EcoNaveStageCanvas
          :runtime-state="runtimeState"
          :stage-id="selectedStageId"
          :quality="quality"
          immersive
        />

        <div class="playfield__shroud top"></div>
        <div class="playfield__shroud bottom"></div>

        <header class="hud-top">
          <div class="hud-top__mission">
            <span class="hud-top__badge">{{ selectedStage.badge }}</span>
            <div class="hud-top__copy">
              <strong>{{ selectedStage.title }}</strong>
              <small>{{ selectedShip.name }} em patrulha orbital</small>
            </div>
          </div>

          <div class="hud-top__actions">
            <button type="button" class="hud-action" @click="$emit('toggle-mission-sheet')">
              <span class="pi pi-compass"></span>
            </button>
            <button
              v-if="isRunning"
              type="button"
              class="hud-action"
              aria-label="Pausar jogo"
              @click="$emit('pause')"
            >
              <span class="pi pi-pause"></span>
            </button>
            <button
              v-else-if="isPaused"
              type="button"
              class="hud-action"
              aria-label="Retomar jogo"
              @click="$emit('resume')"
            >
              <span class="pi pi-play"></span>
            </button>
            <button type="button" class="hud-action" aria-label="Voltar ao briefing" @click="$emit('exit')">
              <span class="pi pi-times"></span>
            </button>
          </div>
        </header>

        <div class="hud-stats">
          <article class="hud-pill score">
            <span>Score</span>
            <strong>{{ hud.score }}</strong>
          </article>
          <article class="hud-pill credits">
            <span>Combo</span>
            <strong>x{{ Math.max(1, hud.combo) }}</strong>
          </article>
          <article class="hud-pill time">
            <span>Tempo</span>
            <strong>{{ hud.timeLeftSeconds.toFixed(1) }}s</strong>
          </article>
        </div>

        <div class="hud-energy">
          <div class="hud-energy__row">
            <span>Energia</span>
            <strong>{{ hud.energy }}/{{ hud.maxEnergy }}</strong>
          </div>
          <div class="kids-progress-bar">
            <div class="kids-progress-fill" :style="{ width: `${energyRatio}%` }"></div>
          </div>
          <div class="hud-energy__chips">
            <span class="mission-chip">Pulso {{ hud.pulseCharges }}</span>
            <span class="mission-chip">Eco {{ hud.ecoScore }}/{{ hud.ecoScoreTarget }}</span>
          </div>
        </div>

        <div class="mission-strip">
          <span class="mission-chip">♻️ {{ hud.collectedCorrect }}/{{ hud.collectTarget }}</span>
          <span class="mission-chip">⚠️ {{ hud.neutralizedHazards }}/{{ hud.neutralizeTarget }}</span>
          <span class="mission-chip">🛰️ {{ hud.protectedSatellites }}/{{ hud.protectTarget }}</span>
        </div>

        <div v-if="activeEffects.length > 0" class="effects-strip">
          <span v-for="effect in activeEffects" :key="effect.id" class="kids-chip info">{{ effect.label }}</span>
        </div>

        <div v-if="latestFeedback" ref="feedbackRef" class="feedback-bubble" :class="latestFeedback.tone">
          <span>{{ latestFeedback.icon }}</span>
          <strong>{{ latestFeedback.text }}</strong>
        </div>

        <div v-if="hud.bossMaxHp > 0" class="boss-bar">
          <div class="boss-bar__copy">
            <span>Boss orbital</span>
            <strong>{{ Math.max(0, hud.bossHp) }}/{{ hud.bossMaxHp }}</strong>
          </div>
          <div class="kids-progress-bar">
            <div class="kids-progress-fill boss" :style="{ width: `${bossRatio}%` }"></div>
          </div>
        </div>

        <button type="button" class="mission-sheet-toggle" @click="$emit('toggle-mission-sheet')">
          <span class="pi pi-angle-up"></span>
          <span>{{ missionSheetOpen ? 'Ocultar missao' : 'Abrir painel da missao' }}</span>
        </button>

        <EcoNaveMissionSheet
          :open="missionSheetOpen"
          :stage="selectedStage"
          :ship="selectedShip"
          :hud="hud"
        />

        <div v-if="isPaused" class="overlay-shell">
          <div class="overlay-card pause">
            <div class="kids-chip warning">Jogo pausado</div>
            <h3>Observe a orbita, reorganize a rota e continue quando quiser.</h3>
            <p>O gameplay volta exatamente de onde parou, sem perder o contexto da missao.</p>
            <div class="overlay-actions">
              <Button label="Retomar" icon="pi pi-play" @click="$emit('resume')" />
              <Button
                label="Voltar ao briefing"
                icon="pi pi-arrow-left"
                severity="secondary"
                outlined
                @click="$emit('exit')"
              />
            </div>
          </div>
        </div>

        <div v-if="currentResult" class="overlay-shell">
          <div ref="resultCardRef" class="overlay-card result">
            <div class="kids-chip" :class="currentResult.victory ? 'success' : 'warning'">
              {{ currentResult.victory ? 'Orbita estabilizada' : 'Missao incompleta' }}
            </div>
            <h3>
              {{
                currentResult.victory
                  ? 'Voce conduziu uma limpeza orbital profissional.'
                  : 'A area ainda precisa de uma nova estrategia.'
              }}
            </h3>
            <p>
              Score {{ currentResult.score }}, {{ currentResult.ecoCreditsEarned }} eco-creditos e
              {{ currentResult.starsEarned }} estrela(s).
            </p>

            <div class="result-stats">
              <div class="result-stat"><span>♻️</span><strong>{{ currentResult.collectedCorrect }}</strong></div>
              <div class="result-stat"><span>⚠️</span><strong>{{ currentResult.neutralizedHazards }}</strong></div>
              <div class="result-stat"><span>🛰️</span><strong>{{ currentResult.protectedSatellites }}</strong></div>
              <div class="result-stat"><span>🌱</span><strong>{{ currentResult.ecoScore }}</strong></div>
            </div>

            <ul class="result-list">
              <li v-for="line in currentResult.summaryLines" :key="line">{{ line }}</li>
            </ul>

            <article class="edu-card">
              <strong>{{ currentResult.educationalCard.title }}</strong>
              <p>{{ currentResult.educationalCard.fact }}</p>
              <small>{{ currentResult.educationalCard.tip }}</small>
            </article>

            <div class="overlay-actions">
              <Button label="Jogar novamente" icon="pi pi-refresh" @click="$emit('restart')" />
              <Button
                v-if="nextStageId && currentResult.victory"
                label="Proxima fase"
                icon="pi pi-arrow-right"
                severity="secondary"
                outlined
                @click="$emit('next-stage')"
              />
              <Button label="Voltar ao briefing" icon="pi pi-home" severity="secondary" outlined @click="$emit('exit')" />
            </div>
          </div>
        </div>
      </div>

      <footer class="controls-dock">
        <div class="controls-dock__cluster move">
          <button
            type="button"
            class="control-btn"
            @pointerdown.prevent="$emit('move', 0, -1)"
            @pointerup="$emit('stop-move')"
            @pointerleave="$emit('stop-move')"
            @pointercancel="$emit('stop-move')"
          >
            ↑
          </button>
          <div class="move-row">
            <button
              type="button"
              class="control-btn"
              @pointerdown.prevent="$emit('move', -1, 0)"
              @pointerup="$emit('stop-move')"
              @pointerleave="$emit('stop-move')"
              @pointercancel="$emit('stop-move')"
            >
              ←
            </button>
            <button
              type="button"
              class="control-btn"
              @pointerdown.prevent="$emit('move', 1, 0)"
              @pointerup="$emit('stop-move')"
              @pointerleave="$emit('stop-move')"
              @pointercancel="$emit('stop-move')"
            >
              →
            </button>
          </div>
          <button
            type="button"
            class="control-btn"
            @pointerdown.prevent="$emit('move', 0, 1)"
            @pointerup="$emit('stop-move')"
            @pointerleave="$emit('stop-move')"
            @pointercancel="$emit('stop-move')"
          >
            ↓
          </button>
        </div>

        <div class="controls-dock__center">
          <span class="kids-chip neutral">{{ keyboardHint }}</span>
        </div>

        <div class="controls-dock__cluster action">
          <button
            type="button"
            class="control-btn secondary"
            @pointerdown.prevent="$emit('fire-start')"
            @pointerup="$emit('fire-stop')"
            @pointerleave="$emit('fire-stop')"
            @pointercancel="$emit('fire-stop')"
          >
            Atirar
          </button>
          <button type="button" class="control-btn primary" @click="$emit('pulse')">Pulso eco</button>
        </div>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { gsap } from 'gsap'
import Button from 'primevue/button'

import EcoNaveMissionSheet from '@/components/econave/EcoNaveMissionSheet.vue'
import EcoNaveStageCanvas from '@/components/econave/EcoNaveStageCanvas.vue'
import type {
  EcoNaveHudSnapshot,
  EcoNaveRenderQuality,
  EcoNaveRuntimeFeedback,
  EcoNaveRuntimeState,
  EcoNaveShipConfig,
  EcoNaveStageConfig,
  EcoNaveStageId,
  EcoNaveStageResult
} from '@/types/econave'

const props = defineProps<{
  runtimeState: EcoNaveRuntimeState
  selectedStage: EcoNaveStageConfig
  selectedStageId: EcoNaveStageId
  selectedShip: EcoNaveShipConfig
  hud: EcoNaveHudSnapshot
  latestFeedback: EcoNaveRuntimeFeedback | null
  currentResult: EcoNaveStageResult | null
  quality: EcoNaveRenderQuality
  isRunning: boolean
  isPaused: boolean
  missionSheetOpen: boolean
  nextStageId: EcoNaveStageId | null
}>()

defineEmits<{
  pause: []
  resume: []
  exit: []
  restart: []
  'next-stage': []
  move: [x: number, y: number]
  'stop-move': []
  'fire-start': []
  'fire-stop': []
  pulse: []
  'toggle-mission-sheet': []
}>()

const resultCardRef = ref<HTMLElement | null>(null)
const feedbackRef = ref<HTMLElement | null>(null)
const keyboardHint = 'Teclado: WASD/setas, espaco para disparar, E para pulso.'

const energyRatio = computed(() =>
  Math.max(0, Math.min(100, (props.hud.energy / Math.max(props.hud.maxEnergy, 1)) * 100)),
)

const bossRatio = computed(() =>
  Math.max(0, Math.min(100, (props.hud.bossHp / Math.max(props.hud.bossMaxHp, 1)) * 100)),
)

const activeEffects = computed(() => {
  const effects = props.hud.activeEffects

  return [
    effects.magnetMs > 0
      ? { id: 'magnet', label: `Ima ${Math.ceil(effects.magnetMs / 1000)}s` }
      : null,
    effects.classifierMs > 0
      ? { id: 'classifier', label: `Classificacao ${Math.ceil(effects.classifierMs / 1000)}s` }
      : null,
    effects.turboMs > 0
      ? { id: 'turbo', label: `Turbo ${Math.ceil(effects.turboMs / 1000)}s` }
      : null,
    effects.slowMs > 0
      ? { id: 'slow', label: `Slow ${Math.ceil(effects.slowMs / 1000)}s` }
      : null
  ].filter(Boolean) as Array<{ id: string; label: string }>
})

watch(
  () => props.currentResult,
  async (result) => {
    if (!result) {
      return
    }

    await nextTick()
    if (!resultCardRef.value) {
      return
    }

    gsap.fromTo(
      resultCardRef.value,
      { scale: 0.92, opacity: 0, y: 24 },
      { scale: 1, opacity: 1, y: 0, duration: 0.42, ease: 'back.out(1.2)' }
    )
  },
)

watch(
  () => props.latestFeedback?.id,
  async () => {
    await nextTick()
    if (!feedbackRef.value) {
      return
    }

    gsap.fromTo(
      feedbackRef.value,
      { y: -14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.22, ease: 'power2.out' }
    )
  },
)
</script>

<style scoped>
.gameplay-shell {
  position: fixed;
  inset: 0;
  z-index: 24;
  padding:
    max(10px, env(safe-area-inset-top))
    max(10px, env(safe-area-inset-right))
    max(12px, env(safe-area-inset-bottom))
    max(10px, env(safe-area-inset-left));
  background:
    radial-gradient(circle at 15% 12%, rgba(56, 189, 248, 0.22), transparent 28%),
    radial-gradient(circle at 82% 18%, rgba(16, 185, 129, 0.16), transparent 24%),
    linear-gradient(180deg, #020617 0%, #061226 52%, #081120 100%);
  overflow: hidden;
}

.gameplay-shell__backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at center, rgba(14, 165, 233, 0.08), transparent 42%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 22%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
}

.gameplay-shell__viewport {
  position: relative;
  z-index: 1;
  height: 100%;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 10px;
}

.playfield {
  position: relative;
  min-height: 0;
  border-radius: 34px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 28px 80px rgba(2, 6, 23, 0.48),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(8, 21, 48, 0.76), rgba(2, 6, 23, 0.92));
}

.playfield__shroud {
  position: absolute;
  left: 0;
  right: 0;
  height: 22%;
  z-index: 2;
  pointer-events: none;
}

.playfield__shroud.top {
  top: 0;
  background: linear-gradient(180deg, rgba(2, 6, 23, 0.62), transparent);
}

.playfield__shroud.bottom {
  bottom: 0;
  height: 28%;
  background: linear-gradient(0deg, rgba(2, 6, 23, 0.78), transparent);
}

.hud-top,
.hud-stats,
.hud-energy,
.mission-strip,
.effects-strip,
.feedback-bubble,
.boss-bar,
.mission-sheet-toggle {
  position: absolute;
  left: 14px;
  right: 14px;
  z-index: 4;
}

.hud-top {
  top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.hud-top__mission {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.hud-top__badge {
  flex: 0 0 auto;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  color: #04111f;
  font-size: 0.82rem;
  font-weight: 900;
}

.hud-top__copy {
  min-width: 0;
  display: grid;
  gap: 4px;
  color: #f8fbff;
}

.hud-top__copy strong,
.hud-top__copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hud-top__copy strong {
  font-size: 1rem;
}

.hud-top__copy small {
  color: rgba(226, 232, 240, 0.82);
}

.hud-top__actions {
  display: flex;
  gap: 8px;
}

.hud-action {
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(5, 12, 29, 0.76);
  color: #f8fbff;
  backdrop-filter: blur(14px);
  box-shadow: 0 14px 24px rgba(2, 6, 23, 0.22);
}

.hud-stats {
  top: 80px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.hud-pill,
.hud-energy {
  border-radius: 20px;
  padding: 12px 14px;
  backdrop-filter: blur(16px);
}

.hud-pill {
  display: grid;
  gap: 5px;
  background: rgba(5, 12, 29, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f8fbff;
}

.hud-pill span {
  color: rgba(226, 232, 240, 0.72);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hud-pill strong {
  font-size: 1.05rem;
}

.hud-pill.score strong {
  color: #bfdbfe;
}

.hud-pill.credits strong {
  color: #fcd34d;
}

.hud-pill.time strong {
  color: #86efac;
}

.hud-energy {
  top: 152px;
  display: grid;
  gap: 10px;
  background: rgba(5, 12, 29, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f8fbff;
}

.hud-energy__row,
.hud-energy__chips,
.mission-strip,
.effects-strip,
.boss-bar__copy,
.overlay-actions,
.controls-dock__cluster {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.hud-energy__row {
  align-items: center;
}

.hud-energy__row span,
.boss-bar__copy span {
  color: rgba(226, 232, 240, 0.82);
  font-weight: 800;
}

.mission-strip {
  top: 238px;
}

.effects-strip {
  top: 284px;
}

.mission-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: #04111f;
  font-weight: 900;
  box-shadow: 0 12px 22px rgba(2, 6, 23, 0.16);
}

.feedback-bubble {
  top: 14px;
  left: auto;
  right: 14px;
  max-width: min(78vw, 320px);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 26px rgba(2, 6, 23, 0.24);
}

.feedback-bubble.positive {
  border: 1px solid rgba(16, 185, 129, 0.24);
}

.feedback-bubble.warning {
  border: 1px solid rgba(245, 158, 11, 0.24);
}

.feedback-bubble.negative {
  border: 1px solid rgba(239, 68, 68, 0.24);
}

.feedback-bubble.mission {
  border: 1px solid rgba(59, 130, 246, 0.24);
}

.boss-bar {
  top: 336px;
  display: grid;
  gap: 8px;
  color: #f8fbff;
  background: rgba(5, 12, 29, 0.56);
  padding: 12px 14px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
}

.kids-progress-fill.boss {
  background: linear-gradient(90deg, #fb923c 0%, #ef4444 100%);
}

.mission-sheet-toggle {
  inset: auto 14px calc(122px + env(safe-area-inset-bottom)) 14px;
  width: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 18px;
  margin: 0 auto;
  border: 0;
  border-radius: 999px;
  background: rgba(5, 12, 29, 0.8);
  color: #f8fbff;
  font-weight: 900;
  box-shadow: 0 18px 32px rgba(2, 6, 23, 0.24);
  backdrop-filter: blur(16px);
}

.overlay-shell {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(2, 6, 23, 0.42);
  backdrop-filter: blur(8px);
}

.overlay-card {
  width: min(100%, 520px);
  max-height: min(100%, 720px);
  overflow: auto;
  display: grid;
  gap: 14px;
  padding: 22px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 24px 56px rgba(2, 6, 23, 0.24);
}

.overlay-card h3,
.overlay-card p,
.overlay-card ul,
.edu-card strong,
.edu-card p {
  margin: 0;
}

.overlay-card p,
.result-list,
.edu-card p {
  color: var(--kids-muted);
  line-height: 1.55;
}

.result-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.result-stat {
  display: grid;
  place-items: center;
  gap: 4px;
  padding: 14px 10px;
  border-radius: 18px;
  background: #eff6ff;
  font-weight: 900;
  color: #17324a;
}

.result-list {
  padding-left: 18px;
  display: grid;
  gap: 8px;
}

.edu-card {
  display: grid;
  gap: 8px;
  padding: 16px;
  border-radius: 22px;
  background: linear-gradient(135deg, #e0f2fe 0%, #eef2ff 100%);
}

.edu-card small {
  color: #1d4ed8;
  line-height: 1.5;
}

.controls-dock {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border-radius: 28px;
  background: rgba(5, 12, 29, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 36px rgba(2, 6, 23, 0.28);
}

.controls-dock__cluster.move {
  display: grid;
  gap: 10px;
  justify-items: center;
}

.move-row {
  display: flex;
  gap: 10px;
}

.controls-dock__center {
  display: none;
  justify-content: center;
}

.control-btn {
  min-width: 82px;
  min-height: 60px;
  border: 0;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  color: #04111f;
  font-weight: 900;
  box-shadow: 0 18px 26px rgba(2, 6, 23, 0.16);
}

.control-btn.primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
  color: #fff;
}

.control-btn.secondary {
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: #fff;
}

@media (min-width: 840px) {
  .gameplay-shell {
    padding:
      max(16px, env(safe-area-inset-top))
      max(18px, env(safe-area-inset-right))
      max(18px, env(safe-area-inset-bottom))
      max(18px, env(safe-area-inset-left));
  }

  .gameplay-shell__viewport {
    grid-template-columns: minmax(0, 1fr);
  }

  .playfield {
    min-height: 0;
  }

  .hud-top,
  .hud-stats,
  .hud-energy,
  .mission-strip,
  .effects-strip,
  .boss-bar,
  .mission-sheet-toggle {
    left: 20px;
    right: 20px;
  }

  .hud-stats {
    top: 88px;
    max-width: 460px;
  }

  .hud-energy {
    top: 88px;
    left: auto;
    width: 280px;
  }

  .mission-strip {
    top: 186px;
    max-width: 520px;
  }

  .effects-strip {
    top: 238px;
    max-width: 520px;
  }

  .boss-bar {
    top: 186px;
    left: auto;
    width: min(320px, calc(100% - 40px));
  }

  .mission-sheet-toggle {
    left: auto;
    right: 20px;
    bottom: 20px;
    width: auto;
    margin: 0;
  }

  .controls-dock {
    grid-template-columns: auto minmax(0, 1fr) auto;
    padding: 12px;
  }

  .controls-dock__center {
    display: flex;
  }
}

@media (max-width: 720px) {
  .hud-top__copy small {
    display: none;
  }

  .hud-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .hud-pill {
    padding: 10px 12px;
  }

  .result-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .controls-dock {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .controls-dock__center {
    display: none;
  }

  .controls-dock__cluster.action {
    align-self: stretch;
  }

  .controls-dock__cluster.action,
  .controls-dock__cluster.move {
    justify-content: stretch;
  }

  .controls-dock__cluster.action .control-btn,
  .controls-dock__cluster.move .control-btn {
    width: 100%;
  }
}

@media (max-width: 559px) {
  .gameplay-shell {
    padding: 0;
  }

  .playfield {
    border-radius: 0;
  }

  .controls-dock {
    border-radius: 26px 26px 0 0;
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }

  .overlay-shell {
    padding: 14px;
  }
}
</style>
