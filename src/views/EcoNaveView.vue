<template>
  <div class="kids-page econave-page">
    <div class="kids-container econave-shell">
      <section v-if="showMenu" class="kids-card econave-hero econave-animate-in">
        <div class="hero-copy">
          <div class="kids-eyebrow">🚀 Missao arcade educativa</div>
          <h1 class="kids-title">EcoNave: Guardioes da Orbita</h1>
          <p class="kids-subtitle">
            {{ playerName }}, pilote uma nave ecológica, limpe a orbita e aprenda que sustentabilidade
            tambem depende de boas escolhas no espaco.
          </p>

          <div class="hero-actions">
            <Button label="Iniciar fase selecionada" icon="pi pi-play" @click="startSelectedStage" />
            <Button
              label="Voltar ao hub"
              icon="pi pi-home"
              severity="secondary"
              outlined
              @click="goHub"
            />
          </div>
        </div>

        <div class="hero-summary">
          <div class="summary-card">
            <span>🌍</span>
            <strong>{{ game.progress.value.ecoCredits }}</strong>
            <small>eco-creditos</small>
          </div>
          <div class="summary-card">
            <span>⭐</span>
            <strong>{{ game.progress.value.totalStars }}/15</strong>
            <small>estrelas de fase</small>
          </div>
          <div class="summary-card">
            <span>🛸</span>
            <strong>{{ game.unlockedStageCount.value }}/5</strong>
            <small>fases liberadas</small>
          </div>
        </div>
      </section>

      <section v-if="showMenu" class="econave-grid">
        <article class="kids-card stage-browser econave-animate-in">
          <div class="browser-header">
            <div>
              <div class="kids-eyebrow">🪐 Jornadas orbitais</div>
              <h2 class="kids-section-title">Selecione sua fase</h2>
            </div>
            <Button
              label="Ajustes"
              icon="pi pi-cog"
              severity="secondary"
              outlined
              @click="showSettings = true"
            />
          </div>

          <div class="stage-list">
            <button
              v-for="stage in stageCards"
              :key="stage.id"
              type="button"
              class="stage-card"
              :class="{
                active: stage.id === game.selectedStageId.value,
                locked: !stage.progress.unlocked
              }"
              :style="{ '--stage-gradient': stage.gradient, '--stage-accent': stage.accentColor }"
              @click="game.selectStageCard(stage.id)"
            >
              <div class="stage-card-top">
                <div>
                  <small>{{ stage.badge }}</small>
                  <strong>{{ stage.title }}</strong>
                </div>
                <span class="kids-chip" :class="stage.progress.unlocked ? 'success' : 'neutral'">
                  {{ stage.progress.unlocked ? `${stage.progress.bestStars}⭐` : 'Bloqueada' }}
                </span>
              </div>
              <p>{{ stage.description }}</p>
              <div class="stage-card-meta">
                <span>Recorde {{ stage.progress.bestScore }}</span>
                <span>Tentativas {{ stage.progress.attempts }}</span>
              </div>
            </button>
          </div>
        </article>

        <article class="kids-card stage-briefing econave-animate-in">
          <div class="briefing-badge" :style="{ background: game.selectedStage.value.gradient }">
            {{ game.selectedStage.value.badge }}
          </div>
          <h2>{{ game.selectedStage.value.title }}</h2>
          <p class="briefing-copy">{{ game.selectedStage.value.description }}</p>

          <div class="goal-grid">
            <div class="kids-stat-pill">
              <span>♻️</span>
              <span>{{ game.selectedStage.value.goals.collectTarget }} coletas corretas</span>
            </div>
            <div class="kids-stat-pill">
              <span>⚠️</span>
              <span>{{ game.selectedStage.value.goals.neutralizeTarget }} neutralizacoes</span>
            </div>
            <div class="kids-stat-pill">
              <span>🛰️</span>
              <span>{{ game.selectedStage.value.goals.protectTarget }} estruturas protegidas</span>
            </div>
            <div class="kids-stat-pill">
              <span>🌱</span>
              <span>ecoScore {{ game.selectedStage.value.goals.ecoScoreTarget }}</span>
            </div>
          </div>

          <ul class="briefing-list">
            <li v-for="mission in game.selectedStage.value.missionLines" :key="mission">{{ mission }}</li>
          </ul>

          <div class="stage-cta-row">
            <Button
              :label="game.stageProgress.value?.unlocked ? 'Jogar agora' : 'Fase bloqueada'"
              icon="pi pi-play"
              :disabled="!game.stageProgress.value?.unlocked"
              @click="startSelectedStage"
            />
            <Button
              label="Ver naves"
              icon="pi pi-send"
              severity="secondary"
              outlined
              @click="scrollToShips"
            />
          </div>
        </article>
      </section>

      <section v-if="showMenu" ref="shipsSectionRef" class="kids-card ships-panel econave-animate-in">
        <div class="browser-header">
          <div>
            <div class="kids-eyebrow">🛸 Frota desbloqueavel</div>
            <h2 class="kids-section-title">Escolha sua nave</h2>
          </div>
          <p class="kids-section-copy">Cada casco muda levemente seu estilo de pilotagem.</p>
        </div>

        <div class="ship-grid">
          <button
            v-for="ship in ships"
            :key="ship.id"
            type="button"
            class="ship-card"
            :class="{
              active: ship.id === game.progress.value.selectedShipId,
              locked: !game.progress.value.unlockedShipIds.includes(ship.id)
            }"
            :style="{ '--ship-gradient': ship.gradient, '--ship-accent': ship.accentColor }"
            @click="selectShip(ship.id)"
          >
            <div class="ship-header">
              <span class="ship-emoji">{{ ship.emoji }}</span>
              <span class="kids-chip" :class="game.progress.value.unlockedShipIds.includes(ship.id) ? 'success' : 'warning'">
                {{
                  game.progress.value.unlockedShipIds.includes(ship.id)
                    ? 'Liberada'
                    : `${ship.unlockCredits} creditos`
                }}
              </span>
            </div>
            <strong>{{ ship.name }}</strong>
            <p>{{ ship.description }}</p>
            <small>{{ ship.educationalBenefit }}</small>
          </button>
        </div>
      </section>

      <section v-if="!showMenu" class="kids-card runtime-shell">
        <header class="runtime-header">
          <div>
            <div class="kids-eyebrow">{{ game.selectedStage.value.badge }}</div>
            <h2 class="kids-section-title runtime-title">{{ game.selectedStage.value.title }}</h2>
          </div>

          <div class="runtime-actions">
            <Button
              v-if="game.isRunning.value"
              label="Pausar"
              icon="pi pi-pause"
              severity="secondary"
              outlined
              @click="game.pauseStage"
            />
            <Button
              v-else-if="game.isPaused.value"
              label="Retomar"
              icon="pi pi-play"
              severity="secondary"
              outlined
              @click="game.resumeStage"
            />
            <Button label="Sair" icon="pi pi-times" severity="secondary" outlined @click="goToBriefing" />
          </div>
        </header>

        <div class="hud-strip">
          <div class="hud-pill">Score {{ game.hud.value.score }}</div>
          <div class="hud-pill">Energia {{ game.hud.value.energy }}/{{ game.hud.value.maxEnergy }}</div>
          <div class="hud-pill">Combo x{{ Math.max(1, game.hud.value.combo) }}</div>
          <div class="hud-pill">Pulso {{ game.hud.value.pulseCharges }}</div>
          <div class="hud-pill accent">{{ game.hud.value.timeLeftSeconds.toFixed(1) }}s</div>
        </div>

        <div class="mission-strip">
          <div class="mission-pill">♻️ {{ game.hud.value.collectedCorrect }}/{{ game.hud.value.collectTarget }}</div>
          <div class="mission-pill">⚠️ {{ game.hud.value.neutralizedHazards }}/{{ game.hud.value.neutralizeTarget }}</div>
          <div class="mission-pill">🛰️ {{ game.hud.value.protectedSatellites }}/{{ game.hud.value.protectTarget }}</div>
          <div class="mission-pill">🌱 {{ game.hud.value.ecoScore }}/{{ game.hud.value.ecoScoreTarget }}</div>
        </div>

        <div class="stage-frame">
          <EcoNaveStageCanvas
            :runtime-state="game.runtimeState.value"
            :stage-id="game.selectedStageId.value"
            :quality="game.progress.value.settings.quality"
          />

          <div v-if="game.latestFeedback.value" class="feedback-bubble" :class="game.latestFeedback.value.tone">
            <span>{{ game.latestFeedback.value.icon }}</span>
            <strong>{{ game.latestFeedback.value.text }}</strong>
          </div>

          <div v-if="game.hud.value.bossMaxHp > 0" class="boss-bar">
            <span>Boss orbital</span>
            <div class="kids-progress-bar">
              <div
                class="kids-progress-fill boss"
                :style="{ width: `${(game.hud.value.bossHp / Math.max(game.hud.value.bossMaxHp, 1)) * 100}%` }"
              ></div>
            </div>
          </div>

          <div v-if="game.isPaused.value" class="overlay-card pause">
            <div class="kids-chip warning">Jogo pausado</div>
            <h3>Respire, observe a orbita e retome quando quiser.</h3>
            <div class="overlay-actions">
              <Button label="Retomar" icon="pi pi-play" @click="game.resumeStage" />
              <Button label="Voltar ao briefing" icon="pi pi-arrow-left" severity="secondary" outlined @click="goToBriefing" />
            </div>
          </div>

          <div v-if="game.currentResult.value" ref="resultCardRef" class="overlay-card result">
            <div class="kids-chip" :class="game.currentResult.value.victory ? 'success' : 'warning'">
              {{ game.currentResult.value.victory ? 'Orbita estabilizada' : 'Missao incompleta' }}
            </div>
            <h3>
              {{
                game.currentResult.value.victory
                  ? 'Voce liderou uma limpeza orbital profissional.'
                  : 'A rota ainda precisa de uma estrategia melhor.'
              }}
            </h3>
            <p>
              Score {{ game.currentResult.value.score }}, {{ game.currentResult.value.ecoCreditsEarned }} eco-creditos
              e {{ game.currentResult.value.starsEarned }} estrela(s).
            </p>

            <div class="goal-grid compact">
              <div class="kids-stat-pill"><span>♻️</span><span>{{ game.currentResult.value.collectedCorrect }}</span></div>
              <div class="kids-stat-pill"><span>⚠️</span><span>{{ game.currentResult.value.neutralizedHazards }}</span></div>
              <div class="kids-stat-pill"><span>🛰️</span><span>{{ game.currentResult.value.protectedSatellites }}</span></div>
              <div class="kids-stat-pill"><span>🌱</span><span>{{ game.currentResult.value.ecoScore }}</span></div>
            </div>

            <ul class="briefing-list result-list">
              <li v-for="line in game.currentResult.value.summaryLines" :key="line">{{ line }}</li>
            </ul>

            <article class="edu-card">
              <strong>{{ game.currentResult.value.educationalCard.title }}</strong>
              <p>{{ game.currentResult.value.educationalCard.fact }}</p>
              <small>{{ game.currentResult.value.educationalCard.tip }}</small>
            </article>

            <div class="overlay-actions">
              <Button label="Jogar novamente" icon="pi pi-refresh" @click="restartCurrentStage" />
              <Button
                v-if="nextStageId && game.currentResult.value.victory"
                label="Proxima fase"
                icon="pi pi-arrow-right"
                severity="secondary"
                outlined
                @click="startNextStage"
              />
              <Button label="Voltar ao briefing" icon="pi pi-home" severity="secondary" outlined @click="goToBriefing" />
            </div>
          </div>
        </div>

        <div class="controls-shell">
          <div class="move-pad">
            <button
              type="button"
              class="control-btn"
              @pointerdown.prevent="setDirection(0, -1)"
              @pointerup="stopDirection"
              @pointerleave="stopDirection"
              @pointercancel="stopDirection"
            >
              ↑
            </button>
            <div class="move-row">
              <button
                type="button"
                class="control-btn"
                @pointerdown.prevent="setDirection(-1, 0)"
                @pointerup="stopDirection"
                @pointerleave="stopDirection"
                @pointercancel="stopDirection"
              >
                ←
              </button>
              <button
                type="button"
                class="control-btn"
                @pointerdown.prevent="setDirection(1, 0)"
                @pointerup="stopDirection"
                @pointerleave="stopDirection"
                @pointercancel="stopDirection"
              >
                →
              </button>
            </div>
            <button
              type="button"
              class="control-btn"
              @pointerdown.prevent="setDirection(0, 1)"
              @pointerup="stopDirection"
              @pointerleave="stopDirection"
              @pointercancel="stopDirection"
            >
              ↓
            </button>
          </div>

          <div class="action-pad">
            <button
              type="button"
              class="control-btn primary"
              @pointerdown.prevent="startFire"
              @pointerup="stopFire"
              @pointerleave="stopFire"
              @pointercancel="stopFire"
            >
              Atirar
            </button>
            <button type="button" class="control-btn secondary" @click="game.triggerPulse">Pulso</button>
          </div>
        </div>

        <div class="tips-row">
          <span class="kids-chip info">Teclado: setas/WASD, espaco para disparar e E para pulso.</span>
        </div>
      </section>
    </div>

    <Dialog v-model:visible="showSettings" modal header="Ajustes do EcoNave" :style="{ width: 'min(92vw, 520px)' }">
      <div class="settings-panel">
        <div class="settings-row">
          <strong>Som geral</strong>
          <Button
            :label="game.progress.value.settings.muted ? 'Ativar som' : 'Silenciar tudo'"
            :icon="game.progress.value.settings.muted ? 'pi pi-volume-up' : 'pi pi-volume-off'"
            severity="secondary"
            outlined
            @click="toggleMute"
          />
        </div>

        <div class="settings-row">
          <strong>Musica</strong>
          <Button
            :label="game.progress.value.settings.musicMuted ? 'Ativar musica' : 'Silenciar musica'"
            icon="pi pi-wave-pulse"
            severity="secondary"
            outlined
            @click="toggleMusic"
          />
        </div>

        <label class="range-field">
          <span>Volume SFX</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            :value="game.progress.value.settings.sfxVolume"
            @input="updateRange('sfxVolume', $event)"
          />
        </label>

        <label class="range-field">
          <span>Volume musica</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            :value="game.progress.value.settings.musicVolume"
            @input="updateRange('musicVolume', $event)"
          />
        </label>

        <div class="quality-row">
          <strong>Qualidade visual</strong>
          <div class="quality-actions">
            <Button
              v-for="option in qualityOptions"
              :key="option.value"
              :label="option.label"
              :severity="game.progress.value.settings.quality === option.value ? 'primary' : 'secondary'"
              :outlined="game.progress.value.settings.quality !== option.value"
              @click="game.updateSettings({ quality: option.value })"
            />
          </div>
        </div>
      </div>
    </Dialog>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

import EcoNaveStageCanvas from '@/components/econave/EcoNaveStageCanvas.vue'
import { useEcoNaveGame } from '@/composables/econave/useEcoNaveGame'
import { ECONAVE_SHIPS } from '@/engine/econave/data/ships'
import { ECONAVE_STAGES } from '@/engine/econave/data/stages'
import { getNextEcoNaveStageId } from '@/engine/econave/runtime/simulation'
import { playerProfileService } from '@/services/playerProfile.service'
import type { EcoNaveRenderQuality, EcoNaveShipId } from '@/types/econave'

const router = useRouter()
const toast = useToast()
const game = useEcoNaveGame()

const showSettings = ref(false)
const resultCardRef = ref<HTMLElement | null>(null)
const shipsSectionRef = ref<HTMLElement | null>(null)
const pressedKeys = new Set<string>()

const qualityOptions: Array<{ label: string; value: EcoNaveRenderQuality }> = [
  { label: 'Alta', value: 'high' },
  { label: 'Balanceada', value: 'balanced' },
  { label: 'Eco', value: 'eco' }
]

const playerName = computed(() => playerProfileService.get()?.name ?? 'Explorador')
const ships = ECONAVE_SHIPS
const stageCards = computed(() =>
  ECONAVE_STAGES.map((stage) => ({
    ...stage,
    progress: game.progress.value.stages[stage.id]
  })),
)
const showMenu = computed(() => !game.runtimeState.value)
const nextStageId = computed(() =>
  game.currentResult.value?.victory ? getNextEcoNaveStageId(game.selectedStageId.value) : null,
)

function animateEntry() {
  gsap.from('.econave-animate-in', {
    y: 26,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: 'power2.out'
  })
}

function syncMovementFromKeyboard() {
  const moveX = (pressedKeys.has('arrowright') || pressedKeys.has('d') ? 1 : 0) - (pressedKeys.has('arrowleft') || pressedKeys.has('a') ? 1 : 0)
  const moveY = (pressedKeys.has('arrowdown') || pressedKeys.has('s') ? 1 : 0) - (pressedKeys.has('arrowup') || pressedKeys.has('w') ? 1 : 0)
  game.setMovement(moveX, moveY)
  game.setFirePressed(pressedKeys.has(' '))
}

function handleKeyDown(event: KeyboardEvent) {
  const key = event.key.toLowerCase()
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' '].includes(key)) {
    event.preventDefault()
    pressedKeys.add(key)
    syncMovementFromKeyboard()
  }

  if (key === 'e') {
    event.preventDefault()
    game.triggerPulse()
  }

  if (key === 'escape' && game.isRunning.value) {
    event.preventDefault()
    game.pauseStage()
  }
}

function handleKeyUp(event: KeyboardEvent) {
  const key = event.key.toLowerCase()
  if (pressedKeys.has(key)) {
    pressedKeys.delete(key)
    syncMovementFromKeyboard()
  }
}

function goHub() {
  router.push('/hub')
}

function startSelectedStage() {
  const started = game.startStage(game.selectedStageId.value)
  if (!started) {
    toast.add({
      severity: 'warn',
      summary: 'Fase bloqueada',
      detail: 'Conclua a fase anterior para liberar esta missao orbital.',
      life: 2400
    })
  }
}

function restartCurrentStage() {
  game.startStage(game.selectedStageId.value)
}

function startNextStage() {
  if (!nextStageId.value) {
    return
  }

  game.selectStageCard(nextStageId.value)
  game.startStage(nextStageId.value)
}

function goToBriefing() {
  game.leaveStage()
  animateEntry()
}

function selectShip(shipId: EcoNaveShipId) {
  const unlocked = game.progress.value.unlockedShipIds.includes(shipId)
  if (!unlocked) {
    toast.add({
      severity: 'info',
      summary: 'Nave ainda bloqueada',
      detail: 'Ganhe mais eco-creditos nas fases para liberar este casco.',
      life: 2600
    })
    return
  }

  game.selectShip(shipId)
}

function setDirection(x: number, y: number) {
  game.setMovement(x, y)
}

function stopDirection() {
  game.stopMovement()
}

function startFire() {
  game.setFirePressed(true)
}

function stopFire() {
  game.setFirePressed(false)
}

function scrollToShips() {
  shipsSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function toggleMute() {
  game.updateSettings({ muted: !game.progress.value.settings.muted })
}

function toggleMusic() {
  game.updateSettings({ musicMuted: !game.progress.value.settings.musicMuted })
}

function updateRange(key: 'sfxVolume' | 'musicVolume', event: Event) {
  const target = event.target as HTMLInputElement
  game.updateSettings({ [key]: Number(target.value) })
}

watch(
  () => game.currentResult.value,
  async (result) => {
    if (!result) {
      return
    }

    if (result.nextStageUnlocked) {
      toast.add({
        severity: 'success',
        summary: 'Nova fase liberada',
        detail: 'A proxima jornada orbital ja pode ser iniciada.',
        life: 2600
      })
    }

    if (result.newlyUnlockedShipIds.length > 0) {
      toast.add({
        severity: 'success',
        summary: 'Nova nave liberada',
        detail: `Frota expandida: ${result.newlyUnlockedShipIds.join(', ')}.`,
        life: 2800
      })
    }

    await nextTick()
    if (resultCardRef.value) {
      gsap.fromTo(
        resultCardRef.value,
        { scale: 0.92, opacity: 0, y: 24 },
        { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.4)' }
      )
    }
  }
)

onMounted(() => {
  game.syncProgress()
  animateEntry()
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})
</script>

<style scoped>
.econave-shell {
  display: grid;
  gap: 24px;
}

.econave-hero,
.stage-browser,
.stage-briefing,
.ships-panel,
.runtime-shell {
  padding: 24px;
}

.econave-hero {
  display: grid;
  gap: 20px;
}

.hero-copy {
  display: grid;
  gap: 16px;
}

.hero-actions {
  display: grid;
  gap: 12px;
}

.hero-summary {
  display: grid;
  gap: 12px;
}

.summary-card {
  padding: 18px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.9);
  display: grid;
  gap: 6px;
}

.econave-grid {
  display: grid;
  gap: 20px;
}

.browser-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 16px;
  margin-bottom: 18px;
}

.stage-list,
.ship-grid {
  display: grid;
  gap: 14px;
}

.stage-card,
.ship-card {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 24px;
  background: var(--stage-gradient, rgba(255, 255, 255, 0.96));
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
  padding: 18px;
  text-align: left;
  display: grid;
  gap: 12px;
}

.stage-card.active,
.ship-card.active {
  outline: 3px solid color-mix(in srgb, var(--stage-accent, var(--ship-accent)) 56%, white);
}

.stage-card.locked,
.ship-card.locked {
  opacity: 0.72;
}

.stage-card-top,
.ship-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.stage-card strong,
.ship-card strong {
  display: block;
  font-size: 1.1rem;
}

.stage-card small,
.stage-card p,
.ship-card p,
.ship-card small,
.briefing-copy {
  color: var(--kids-muted);
  line-height: 1.5;
  margin: 0;
}

.stage-card-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-weight: 800;
  color: #27445e;
}

.stage-briefing {
  display: grid;
  gap: 16px;
}

.briefing-badge {
  justify-self: start;
  padding: 10px 16px;
  border-radius: 999px;
  color: white;
  font-weight: 900;
}

.goal-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.goal-grid.compact {
  gap: 10px;
}

.briefing-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: #4b5d71;
}

.stage-cta-row {
  display: grid;
  gap: 12px;
}

.ship-emoji {
  width: 56px;
  height: 56px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.9);
}

.runtime-shell {
  display: grid;
  gap: 16px;
}

.runtime-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 16px;
}

.runtime-title {
  margin-bottom: 0;
}

.runtime-actions,
.hud-strip,
.mission-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hud-pill,
.mission-pill {
  border-radius: 18px;
  padding: 10px 14px;
  font-weight: 900;
  background: rgba(255, 255, 255, 0.88);
}

.hud-pill.accent {
  background: #dbeafe;
  color: #1d4ed8;
}

.stage-frame {
  position: relative;
  aspect-ratio: 9 / 16;
  min-height: 480px;
  border-radius: 34px;
  overflow: hidden;
  background: linear-gradient(180deg, #082f49 0%, #1d4ed8 100%);
}

.feedback-bubble,
.boss-bar,
.overlay-card {
  position: absolute;
  left: 14px;
  right: 14px;
}

.feedback-bubble {
  top: 16px;
  padding: 12px 14px;
  border-radius: 18px;
  display: flex;
  gap: 10px;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.18);
}

.feedback-bubble.positive {
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.feedback-bubble.warning {
  border: 1px solid rgba(245, 158, 11, 0.28);
}

.feedback-bubble.negative {
  border: 1px solid rgba(239, 68, 68, 0.28);
}

.feedback-bubble.mission {
  border: 1px solid rgba(59, 130, 246, 0.28);
}

.boss-bar {
  top: 84px;
  display: grid;
  gap: 8px;
  color: white;
  font-weight: 900;
}

.kids-progress-fill.boss {
  background: linear-gradient(90deg, #f97316 0%, #ef4444 100%);
}

.overlay-card {
  inset: auto 14px 14px 14px;
  padding: 20px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.26);
  display: grid;
  gap: 14px;
}

.overlay-card.pause {
  bottom: 14px;
}

.overlay-card.result {
  max-height: calc(100% - 28px);
  overflow: auto;
}

.overlay-card h3,
.edu-card strong {
  margin: 0;
}

.overlay-card p,
.edu-card p {
  margin: 0;
  color: var(--kids-muted);
  line-height: 1.55;
}

.overlay-actions {
  display: grid;
  gap: 10px;
}

.edu-card {
  padding: 16px 18px;
  border-radius: 22px;
  background: #eff6ff;
  display: grid;
  gap: 8px;
}

.edu-card small {
  color: #1d4ed8;
}

.controls-shell {
  display: grid;
  gap: 16px;
}

.move-pad,
.action-pad {
  display: grid;
  gap: 12px;
}

.move-pad {
  justify-items: center;
}

.move-row {
  display: flex;
  gap: 12px;
}

.control-btn {
  min-width: 88px;
  min-height: 58px;
  border: 0;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 16px 28px rgba(15, 23, 42, 0.1);
  font-weight: 900;
  color: #163047;
}

.control-btn.primary {
  background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
  color: white;
}

.control-btn.secondary {
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
}

.tips-row {
  display: flex;
  flex-wrap: wrap;
}

.settings-panel {
  display: grid;
  gap: 16px;
}

.settings-row,
.quality-row {
  display: grid;
  gap: 12px;
}

.range-field {
  display: grid;
  gap: 8px;
}

.range-field input {
  width: 100%;
}

.quality-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (min-width: 860px) {
  .econave-hero {
    grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
    align-items: center;
  }

  .hero-summary {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .econave-grid {
    grid-template-columns: minmax(0, 1fr) minmax(360px, 0.92fr);
    align-items: start;
  }

  .stage-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ship-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .controls-shell {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }

  .stage-cta-row,
  .overlay-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
