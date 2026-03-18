<template>
  <div class="kids-page econave-page" :class="{ 'is-gameplay': !showMenu }">
    <div v-if="showMenu" ref="menuRootRef" class="kids-container econave-command">
      <section class="kids-card kids-card-strong econave-overview econave-panel">
        <div class="econave-overview__copy">
          <div class="kids-eyebrow">Missao arcade educativa</div>
          <h1 class="kids-title">EcoNave: Guardioes da Orbita</h1>
          <p class="kids-subtitle">
            {{ playerName }}, sua nave limpa a orbita, protege tecnologia util e ensina que
            sustentabilidade depende de boas decisoes em qualquer ambiente.
          </p>

          <div class="econave-overview__actions">
            <Button label="Jogar fase selecionada" icon="pi pi-play" @click="startSelectedStage" />
            <Button
              label="Ajustes"
              icon="pi pi-cog"
              severity="secondary"
              outlined
              @click="showSettings = true"
            />
          </div>

          <div class="econave-overview__chips">
            <span class="kids-chip info">{{ game.selectedStage.value.badge }} pronto para a rota</span>
            <span class="kids-chip success">{{ game.selectedShip.value.name }} em destaque</span>
          </div>
        </div>

        <div class="econave-overview__side">
          <div class="hero-kpis">
            <article class="hero-kpi">
              <span>Eco-creditos</span>
              <strong>{{ game.progress.value.ecoCredits }}</strong>
            </article>
            <article class="hero-kpi">
              <span>Estrelas</span>
              <strong>{{ game.progress.value.totalStars }}/15</strong>
            </article>
            <article class="hero-kpi">
              <span>Fases liberadas</span>
              <strong>{{ game.unlockedStageCount.value }}/5</strong>
            </article>
          </div>

          <article
            class="hero-spotlight"
            :style="{ '--spotlight-gradient': game.selectedStage.value.gradient, '--spotlight-accent': game.selectedStage.value.accentColor }"
          >
            <div class="hero-spotlight__top">
              <div>
                <small>{{ game.selectedStage.value.themeName }}</small>
                <strong>{{ game.selectedStage.value.title }}</strong>
              </div>
              <span class="kids-chip" :class="game.stageProgress.value?.unlocked ? 'success' : 'neutral'">
                {{ game.stageProgress.value?.unlocked ? 'Liberada' : 'Bloqueada' }}
              </span>
            </div>

            <p>{{ game.selectedStage.value.description }}</p>

            <div class="hero-spotlight__meta">
              <span>Recorde {{ game.stageProgress.value?.bestScore ?? 0 }}</span>
              <span>{{ game.selectedShip.value.name }}</span>
            </div>
          </article>
        </div>
      </section>

      <section class="kids-card econave-nav-shell econave-panel">
        <div class="econave-nav-shell__tabs" role="tablist" aria-label="Navegacao do modulo EcoNave">
          <button
            v-for="tab in menuTabs"
            :key="tab.id"
            type="button"
            class="nav-tab"
            :class="{ active: activePanel === tab.id }"
            @click="activePanel = tab.id"
          >
            <span class="nav-tab__icon">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <div class="econave-nav-shell__actions">
          <Button
            label="Voltar ao hub"
            icon="pi pi-home"
            severity="secondary"
            outlined
            @click="goHub"
          />
          <Button label="Jogar agora" icon="pi pi-play" @click="startSelectedStage" />
        </div>
      </section>

      <section class="kids-card econave-content-shell econave-panel">
        <div ref="panelBodyRef" :key="activePanel" class="econave-panel-body">
          <div v-if="activePanel === 'overview'" class="overview-panel">
            <article class="overview-panel__mission">
              <div class="overview-panel__heading">
                <div>
                  <div class="kids-eyebrow">Missao atual</div>
                  <h2 class="kids-section-title">Briefing rapido da sua rota</h2>
                </div>
                <span class="kids-chip info">{{ game.selectedStage.value.badge }}</span>
              </div>

              <div class="overview-panel__goal-grid">
                <div class="goal-card">
                  <span>♻️ Coletas</span>
                  <strong>{{ game.selectedStage.value.goals.collectTarget }}</strong>
                </div>
                <div class="goal-card">
                  <span>⚠️ Neutralizacoes</span>
                  <strong>{{ game.selectedStage.value.goals.neutralizeTarget }}</strong>
                </div>
                <div class="goal-card">
                  <span>🛰️ Estruturas</span>
                  <strong>{{ game.selectedStage.value.goals.protectTarget }}</strong>
                </div>
                <div class="goal-card">
                  <span>🌱 EcoScore</span>
                  <strong>{{ game.selectedStage.value.goals.ecoScoreTarget }}</strong>
                </div>
              </div>

              <ul class="overview-panel__list">
                <li v-for="mission in game.selectedStage.value.missionLines" :key="mission">{{ mission }}</li>
              </ul>
            </article>

            <div class="overview-panel__side">
              <article class="overview-card">
                <div class="overview-card__header">
                  <div>
                    <small>Fase selecionada</small>
                    <strong>{{ game.selectedStage.value.title }}</strong>
                  </div>
                  <Button
                    label="Trocar fase"
                    icon="pi pi-compass"
                    severity="secondary"
                    outlined
                    @click="activePanel = 'stages'"
                  />
                </div>
                <p>{{ game.selectedStage.value.description }}</p>
                <div class="overview-card__meta">
                  <span>Recorde {{ game.stageProgress.value?.bestScore ?? 0 }}</span>
                  <span>{{ game.stageProgress.value?.attempts ?? 0 }} tentativa(s)</span>
                </div>
              </article>

              <article class="overview-card">
                <div class="overview-card__header">
                  <div>
                    <small>Nave selecionada</small>
                    <strong>{{ game.selectedShip.value.name }}</strong>
                  </div>
                  <Button
                    label="Trocar nave"
                    icon="pi pi-send"
                    severity="secondary"
                    outlined
                    @click="activePanel = 'ships'"
                  />
                </div>
                <p>{{ game.selectedShip.value.educationalBenefit }}</p>
                <div class="overview-card__meta">
                  <span>Energia {{ game.selectedShip.value.stats.maxEnergy }}</span>
                  <span>Pulso {{ game.selectedShip.value.stats.startingPulseCharges }}</span>
                </div>
              </article>
            </div>
          </div>

          <EcoNaveStageSelector
            v-else-if="activePanel === 'stages'"
            :stage-cards="stageCards"
            :selected-stage-id="game.selectedStageId.value"
            @select="game.selectStageCard"
            @start="startSelectedStage"
          />

          <EcoNaveShipSelector
            v-else
            :ships="ships"
            :selected-ship-id="game.progress.value.selectedShipId"
            :unlocked-ship-ids="game.progress.value.unlockedShipIds"
            :eco-credits="game.progress.value.ecoCredits"
            @select="selectShip"
          />
        </div>
      </section>
    </div>

    <EcoNaveGameplayShell
      v-else-if="game.runtimeState.value"
      :runtime-state="game.runtimeState.value"
      :selected-stage="game.selectedStage.value"
      :selected-stage-id="game.selectedStageId.value"
      :selected-ship="game.selectedShip.value"
      :hud="game.hud.value"
      :latest-feedback="game.latestFeedback.value"
      :current-result="game.currentResult.value"
      :quality="game.progress.value.settings.quality"
      :is-running="game.isRunning.value"
      :is-paused="game.isPaused.value"
      :mission-sheet-open="missionSheetOpen"
      :next-stage-id="nextStageId"
      @pause="game.pauseStage"
      @resume="game.resumeStage"
      @exit="goToBriefing"
      @restart="restartCurrentStage"
      @next-stage="startNextStage"
      @move="setDirection"
      @stop-move="stopDirection"
      @fire-start="startFire"
      @fire-stop="stopFire"
      @pulse="game.triggerPulse"
      @toggle-mission-sheet="toggleMissionSheet"
    />

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

import EcoNaveGameplayShell from '@/components/econave/EcoNaveGameplayShell.vue'
import EcoNaveShipSelector from '@/components/econave/EcoNaveShipSelector.vue'
import EcoNaveStageSelector from '@/components/econave/EcoNaveStageSelector.vue'
import { useEcoNaveGame } from '@/composables/econave/useEcoNaveGame'
import { ECONAVE_SHIPS } from '@/engine/econave/data/ships'
import { ECONAVE_STAGES } from '@/engine/econave/data/stages'
import { getNextEcoNaveStageId } from '@/engine/econave/runtime/simulation'
import { playerProfileService } from '@/services/playerProfile.service'
import type { EcoNaveRenderQuality, EcoNaveShipId } from '@/types/econave'

type EcoNaveMenuPanel = 'overview' | 'stages' | 'ships'

const router = useRouter()
const toast = useToast()
const game = useEcoNaveGame()

const menuRootRef = ref<HTMLElement | null>(null)
const panelBodyRef = ref<HTMLElement | null>(null)
const showSettings = ref(false)
const missionSheetOpen = ref(false)
const activePanel = ref<EcoNaveMenuPanel>('overview')
const pressedKeys = new Set<string>()

const qualityOptions: Array<{ label: string; value: EcoNaveRenderQuality }> = [
  { label: 'Alta', value: 'high' },
  { label: 'Balanceada', value: 'balanced' },
  { label: 'Eco', value: 'eco' }
]

const menuTabs: Array<{ id: EcoNaveMenuPanel; label: string; icon: string }> = [
  { id: 'overview', label: 'Visao geral', icon: '🌍' },
  { id: 'stages', label: 'Fases', icon: '🪐' },
  { id: 'ships', label: 'Naves', icon: '🛸' }
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

function animateMenuPanels() {
  if (!menuRootRef.value) {
    return
  }

  const nodes = menuRootRef.value.querySelectorAll<HTMLElement>('.econave-panel')
  gsap.fromTo(
    nodes,
    { y: 26, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.56,
      stagger: 0.08,
      ease: 'power2.out',
      clearProps: 'transform,opacity'
    }
  )
}

function animateActivePanel() {
  if (!panelBodyRef.value) {
    return
  }

  gsap.fromTo(
    panelBodyRef.value,
    { y: 18, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.36,
      ease: 'power2.out',
      clearProps: 'transform,opacity'
    }
  )
}

function syncMovementFromKeyboard() {
  const moveX =
    (pressedKeys.has('arrowright') || pressedKeys.has('d') ? 1 : 0) -
    (pressedKeys.has('arrowleft') || pressedKeys.has('a') ? 1 : 0)
  const moveY =
    (pressedKeys.has('arrowdown') || pressedKeys.has('s') ? 1 : 0) -
    (pressedKeys.has('arrowup') || pressedKeys.has('w') ? 1 : 0)
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

  if (key === 'escape') {
    event.preventDefault()
    if (game.isRunning.value) {
      game.pauseStage()
      return
    }

    if (game.isPaused.value) {
      game.resumeStage()
    }
  }
}

function handleKeyUp(event: KeyboardEvent) {
  const key = event.key.toLowerCase()
  if (pressedKeys.has(key)) {
    pressedKeys.delete(key)
    syncMovementFromKeyboard()
  }
}

function applyScrollLock(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  document.body.style.overflow = locked ? 'hidden' : ''
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
    activePanel.value = 'stages'
    return
  }

  missionSheetOpen.value = false
}

function restartCurrentStage() {
  missionSheetOpen.value = false
  game.restartStage()
}

function startNextStage() {
  if (!nextStageId.value) {
    return
  }

  game.selectStageCard(nextStageId.value)
  missionSheetOpen.value = false
  game.startStage(nextStageId.value)
}

function goToBriefing() {
  missionSheetOpen.value = false
  game.leaveStage()
  activePanel.value = 'overview'
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
  toast.add({
    severity: 'success',
    summary: 'Nave equipada',
    detail: `${game.selectedShip.value.name} pronta para a proxima patrulha orbital.`,
    life: 1800
  })
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

function toggleMissionSheet() {
  missionSheetOpen.value = !missionSheetOpen.value
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
  (result) => {
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
  }
)

watch(
  () => activePanel.value,
  async () => {
    await nextTick()
    animateActivePanel()
  }
)

watch(
  () => showMenu.value,
  async (menu) => {
    applyScrollLock(!menu)

    if (menu) {
      await nextTick()
      animateMenuPanels()
      animateActivePanel()
      return
    }

    missionSheetOpen.value = false
  },
  { immediate: true }
)

onMounted(() => {
  game.syncProgress()
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  animateMenuPanels()
  animateActivePanel()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  applyScrollLock(false)
})
</script>

<style scoped>
.econave-page {
  overflow-x: clip;
  background:
    radial-gradient(circle at 12% 12%, rgba(56, 189, 248, 0.18), transparent 24%),
    radial-gradient(circle at 88% 16%, rgba(16, 185, 129, 0.16), transparent 18%),
    linear-gradient(180deg, #03111f 0%, #07223f 26%, #eff8ff 26%, #fff7ed 100%);
}

.econave-page.is-gameplay {
  padding: 0;
  background: transparent;
}

.econave-command {
  display: grid;
  gap: 16px;
}

.econave-panel {
  overflow: hidden;
}

.econave-overview,
.econave-nav-shell,
.econave-content-shell {
  padding: 18px;
}

.econave-overview {
  position: relative;
  display: grid;
  gap: 20px;
  background:
    radial-gradient(circle at top right, rgba(56, 189, 248, 0.22), transparent 28%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(239, 246, 255, 0.94) 100%);
}

.econave-overview::after {
  content: '';
  position: absolute;
  inset: auto -12% -24% auto;
  width: 220px;
  height: 220px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.26), rgba(16, 185, 129, 0.16));
  filter: blur(24px);
  pointer-events: none;
}

.econave-overview__copy,
.econave-overview__side {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 16px;
}

.econave-overview__actions {
  display: grid;
  gap: 12px;
}

.econave-overview__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hero-kpis {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.hero-kpi {
  padding: 16px;
  border-radius: 22px;
  display: grid;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.16);
  box-shadow: 0 16px 28px rgba(15, 23, 42, 0.08);
}

.hero-kpi span {
  color: var(--kids-muted);
  font-size: 0.82rem;
  font-weight: 800;
}

.hero-kpi strong {
  font-size: 1.35rem;
}

.hero-spotlight {
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 14px;
  padding: 18px;
  border-radius: 26px;
  background:
    linear-gradient(180deg, rgba(4, 17, 31, 0.82) 0%, rgba(8, 18, 41, 0.94) 100%);
  color: #f8fbff;
  box-shadow: 0 22px 40px rgba(15, 23, 42, 0.16);
}

.hero-spotlight::before {
  content: '';
  position: absolute;
  inset: auto -12% -28% auto;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: var(--spotlight-gradient);
  filter: blur(28px);
  opacity: 0.46;
}

.hero-spotlight__top,
.hero-spotlight__meta,
.overview-card__header,
.overview-card__meta,
.econave-nav-shell {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.hero-spotlight__top,
.hero-spotlight__meta {
  position: relative;
  z-index: 1;
}

.hero-spotlight__top small {
  color: rgba(226, 232, 240, 0.76);
}

.hero-spotlight__top strong {
  display: block;
  margin-top: 6px;
  font-size: 1.1rem;
}

.hero-spotlight p {
  position: relative;
  z-index: 1;
  margin: 0;
  color: rgba(226, 232, 240, 0.92);
  line-height: 1.55;
}

.hero-spotlight__meta {
  margin-top: auto;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.88);
  flex-wrap: wrap;
}

.econave-nav-shell {
  position: sticky;
  top: calc(10px + env(safe-area-inset-top));
  z-index: 3;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
}

.econave-nav-shell__tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.nav-tab {
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(255, 255, 255, 0.78);
  min-height: 58px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 14px;
  font-weight: 900;
  color: #163047;
  transition:
    transform 160ms ease,
    background 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.nav-tab.active {
  background: linear-gradient(135deg, #dbeafe 0%, #ecfeff 100%);
  border-color: rgba(37, 99, 235, 0.18);
  box-shadow: 0 16px 28px rgba(59, 130, 246, 0.12);
}

.nav-tab:hover,
.nav-tab:focus-visible {
  transform: translateY(-1px);
}

.nav-tab__icon {
  font-size: 1rem;
}

.econave-nav-shell__actions {
  display: grid;
  gap: 10px;
  width: 100%;
}

.econave-content-shell {
  background:
    radial-gradient(circle at top right, rgba(56, 189, 248, 0.1), transparent 26%),
    linear-gradient(180deg, rgba(3, 17, 31, 0.94) 0%, rgba(7, 34, 63, 0.96) 100%);
  color: #f8fbff;
  box-shadow: 0 30px 60px rgba(2, 6, 23, 0.16);
}

.econave-panel-body {
  display: grid;
  gap: 16px;
}

.overview-panel {
  display: grid;
  gap: 16px;
}

.overview-panel__mission,
.overview-card {
  display: grid;
  gap: 16px;
  padding: 18px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
}

.overview-panel__heading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.overview-panel__goal-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.goal-card {
  display: grid;
  gap: 8px;
  padding: 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
}

.goal-card span,
.overview-card small {
  color: rgba(226, 232, 240, 0.78);
  font-size: 0.84rem;
}

.goal-card strong {
  font-size: 1.15rem;
}

.overview-panel__list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 10px;
  color: rgba(226, 232, 240, 0.92);
}

.overview-panel__side {
  display: grid;
  gap: 16px;
}

.overview-card strong,
.overview-card p {
  margin: 0;
}

.overview-card p {
  color: rgba(226, 232, 240, 0.92);
  line-height: 1.55;
}

.overview-card__header {
  flex-wrap: wrap;
}

.overview-card__meta {
  color: rgba(255, 255, 255, 0.84);
  font-weight: 800;
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
  .econave-overview {
    grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
    align-items: center;
  }

  .econave-overview__actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: 420px;
  }

  .econave-nav-shell {
    flex-direction: row;
    align-items: center;
  }

  .econave-nav-shell__tabs {
    flex: 1 1 auto;
  }

  .econave-nav-shell__actions {
    width: auto;
    grid-template-columns: repeat(2, auto);
    justify-content: end;
  }

  .overview-panel {
    grid-template-columns: minmax(0, 1.08fr) minmax(300px, 0.92fr);
    align-items: start;
  }
}

@media (max-width: 759px) {
  .hero-kpis {
    grid-template-columns: 1fr;
  }

  .econave-nav-shell__tabs {
    grid-template-columns: 1fr;
  }

  .overview-panel__goal-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 599px) {
  .econave-overview,
  .econave-nav-shell,
  .econave-content-shell {
    padding: 16px;
  }

  .overview-panel__goal-grid {
    grid-template-columns: 1fr;
  }

  .hero-spotlight__top,
  .hero-spotlight__meta,
  .overview-panel__heading,
  .overview-card__header,
  .overview-card__meta {
    flex-direction: column;
  }
}
</style>
