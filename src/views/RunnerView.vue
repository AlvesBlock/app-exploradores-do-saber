<template>
  <div
    ref="gameShellRef"
    class="runner-mobile-shell"
    :class="[`status-${gameState.status}`, { 'is-playing': isPlaying }]"
  >
    <div class="runner-mobile-stage" :style="{ backgroundImage: `url(${currentBackground})` }">
      <div class="runner-stage-overlay"></div>
      <div class="runner-stage-ground-glow"></div>

      <div v-if="flashTone" class="runner-flash" :class="flashTone"></div>

      <div v-if="feedbackText" class="runner-feedback-text" :class="feedbackTone">
        <span>{{ feedbackIcon }}</span>
        <span>{{ feedbackText }}</span>
      </div>

      <header class="runner-hud">
        <div class="hud-row hud-left">
          <div class="hud-pill accent">Round {{ gameState.roundProgress.currentRound }}/10</div>
          <div class="hud-pill">Vida {{ gameState.stats.lives }}</div>
          <div class="hud-pill">Run {{ gameState.stats.coins }}</div>
          <div class="hud-pill subtle">Banco {{ gameState.meta.walletCoins }}</div>
        </div>

        <div class="hud-center">
          <div class="hud-progress-top">
            <span>Meta {{ gameState.stats.qualifiedCollects }}/{{ gameState.stats.minCollectibles }}</span>
            <span>{{ formattedTime }}</span>
          </div>
          <div class="hud-progress-bar">
            <div class="hud-progress-fill" :style="{ width: `${progressPercent}%` }"></div>
          </div>
          <div class="hud-progress-bottom">
            <span>Score {{ gameState.stats.score }}</span>
            <span>{{ Math.floor(gameState.stats.distance) }}/{{ gameState.stats.targetDistance }}</span>
          </div>
          <div class="shield-row">
            <span>Escudo {{ gameState.player.shieldCharge }}/{{ gameState.player.shieldChargeNeeded }}</span>
            <div class="shield-bar">
              <div class="shield-fill" :style="{ width: `${shieldChargePercent}%` }"></div>
            </div>
          </div>
        </div>

        <div class="hud-row hud-right">
          <button class="hud-icon-btn" @click="onPauseOrResume">
            <span v-if="gameState.status === 'running'">II</span>
            <span v-else>></span>
          </button>
          <button class="hud-icon-btn danger" @click="exitRunner">X</button>
        </div>
      </header>

      <div class="runner-status-overlay">
        <span class="status-pill" :class="gameState.status">{{ statusLabel }}</span>
        <span class="status-caption">{{ gameState.roundProgress.currentRoundConfig.title }}</span>
      </div>

      <div
        class="runner-road"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <div class="road-edge-glow left"></div>
        <div class="road-edge-glow right"></div>
        <div class="lane lane-left"></div>
        <div class="lane lane-center"></div>
        <div class="lane lane-right"></div>

        <div
          v-for="marker in gameState.roadMarkers"
          :key="marker.id"
          class="road-marker"
          :style="getRoadMarkerStyle(marker.depth)"
        />

        <div
          v-for="entity in gameState.entities"
          :key="entity.id"
          class="runner-entity"
          :class="[entity.type, entity.collectibleClass, entity.obstacleSeverity]"
          :style="getEntityStyle(entity.lane, entity.depth)"
        >
          <span class="entity-icon">{{ entity.emoji }}</span>
          <span v-if="entity.collectibleClass === 'special'" class="entity-tag special">BONUS</span>
          <span v-else-if="entity.collectibleClass === 'risky'" class="entity-tag risky">CUIDADO</span>
          <span v-else-if="entity.collectibleClass === 'bad'" class="entity-tag bad">FORA META</span>
        </div>

        <div class="runner-player" :class="{ shield: gameState.player.shieldActive }" :style="playerStyle">
          {{ currentVehicleEmoji }}
        </div>
      </div>

      <div v-if="showStartOverlay" class="runner-start-overlay">
        <div class="runner-panel">
          <div class="runner-chip">Modo Arcade</div>
          <h1>Runner da Reciclagem</h1>
          <p>
            Leia a pista, colete reciclaveis qualificados e use o escudo para transformar itens arriscados em recompensa.
          </p>

          <div class="selector-row">
            <button class="selector-btn" :disabled="!canSelectPreviousRound" @click="changeRound(-1)">&lt;</button>
            <div class="selector-summary">
              <strong>Round {{ gameState.roundProgress.currentRound }}</strong>
              <span>{{ gameState.roundProgress.currentRoundConfig.title }}</span>
              <small>{{ gameState.roundProgress.currentRoundConfig.notes }}</small>
            </div>
            <button class="selector-btn" :disabled="!canSelectNextRound" @click="changeRound(1)">&gt;</button>
          </div>

          <div class="start-stats">
            <span>Meta {{ gameState.stats.minCollectibles }}</span>
            <span>Escudo {{ gameState.player.shieldChargeNeeded }}</span>
            <span>Tempo {{ gameState.roundProgress.currentRoundConfig.durationSeconds }}s</span>
            <span>Banco {{ gameState.meta.walletCoins }} / {{ gameState.meta.walletCarbonCredits }}</span>
          </div>

          <div class="vehicle-grid">
            <button
              v-for="vehicle in availableVehicles"
              :key="vehicle.id"
              class="vehicle-chip"
              :class="{ active: vehicle.id === gameState.meta.selectedVehicleId }"
              @click="chooseVehicle(vehicle.id)"
            >
              <span>{{ vehicle.emoji }}</span>
              <span>{{ vehicle.name }}</span>
            </button>
          </div>

          <div class="goal-grid">
            <div>
              <strong>Coletar</strong>
              <span>Itens bons contam. Itens de risco rendem melhor com escudo.</span>
            </div>
            <div>
              <strong>Evitar</strong>
              <span>Obstaculos custam vida, score e controle do round.</span>
            </div>
            <div>
              <strong>Fechar</strong>
              <span>Chegue ao fim do percurso batendo a meta de coleta.</span>
            </div>
          </div>

          <button class="primary-cta" @click="startExperience">Jogar agora</button>
          <button class="secondary-cta" @click="enableMotionControl">
            {{ motionEnabled ? 'Sensor ativado' : 'Ativar controle por movimento' }}
          </button>
          <button class="ghost-cta" @click="goHub">Voltar ao hub</button>
        </div>
      </div>

      <div v-if="showPauseOverlay" class="runner-modal-overlay">
        <div class="runner-panel">
          <template v-if="gameState.status === 'paused'">
            <h2>Jogo pausado</h2>
            <p>Respire, releia a pista e retome quando quiser.</p>
          </template>

          <template v-else>
            <h2>{{ gameState.status === 'victory' ? 'Round concluido' : 'Round encerrado' }}</h2>
            <p>{{ gameState.roundProgress.finalSummaryText }}</p>

            <div v-if="gameState.roundProgress.finalResult" class="result-grid">
              <div><strong>Score</strong><span>{{ gameState.roundProgress.finalResult.scoreFinal }}</span></div>
              <div><strong>Moedas</strong><span>+{{ gameState.roundProgress.finalResult.coinsEarned }}</span></div>
              <div><strong>Creditos</strong><span>+{{ gameState.roundProgress.finalResult.carbonCreditsEarned }}</span></div>
              <div><strong>Acertos</strong><span>{{ gameState.stats.qualifiedCollects }}</span></div>
              <div><strong>Riscos</strong><span>{{ gameState.stats.riskyCollects }}</span></div>
              <div><strong>Erros</strong><span>{{ gameState.stats.invalidCollects + gameState.stats.collisionsTaken }}</span></div>
            </div>

            <div v-if="gameState.roundProgress.finalCard" class="final-card">
              <div class="final-card-icon">{{ gameState.roundProgress.finalCard.icon }}</div>
              <div>
                <strong>{{ gameState.roundProgress.finalCard.title }}</strong>
                <p>{{ gameState.roundProgress.finalCard.message }}</p>
                <small>{{ gameState.roundProgress.finalCard.tip }}</small>
              </div>
            </div>

            <div
              v-if="gameState.roundProgress.finalResult?.newlyUnlockedVehicleIds.length"
              class="unlock-banner"
            >
              Novo veiculo liberado:
              {{
                gameState.roundProgress.finalResult.newlyUnlockedVehicleIds
                  .map((vehicleId) => getVehicleLabel(vehicleId))
                  .join(', ')
              }}
            </div>
          </template>

          <div class="pause-actions">
            <button v-if="gameState.status === 'paused'" class="primary-cta" @click="resumeRunner">
              Continuar
            </button>
            <button
              v-if="gameState.status === 'victory' && gameState.roundProgress.finalResult?.canAdvanceToNextRound"
              class="primary-cta"
              @click="startNextRound"
            >
              Proximo round
            </button>
            <button
              v-if="gameState.status === 'victory' || gameState.status === 'gameover'"
              class="secondary-cta"
              @click="restartExperience"
            >
              Jogar novamente
            </button>
            <button
              v-if="gameState.status === 'victory' || gameState.status === 'gameover'"
              class="secondary-cta"
              @click="returnToLoadout"
            >
              Trocar round ou veiculo
            </button>
            <button class="ghost-cta" @click="exitRunner">Sair</button>
          </div>
        </div>
      </div>

      <div v-if="isPlaying" class="runner-controls">
        <button class="control-btn" @touchstart.prevent="moveLeft" @click="moveLeft">&lt;</button>
        <button class="control-btn shield" :disabled="!canActivateShield" @touchstart.prevent="useShield" @click="useShield">
          <span>Shield</span>
          <small>{{ shieldChargePercent }}%</small>
        </button>
        <button class="control-btn heal" :disabled="!canUseEmergencyHealNow" @touchstart.prevent="useHeal" @click="useHeal">
          <span>Heal</span>
          <small>{{ emergencyHealCostLabel }}</small>
        </button>
        <button class="control-btn" @touchstart.prevent="moveRight" @click="moveRight">&gt;</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import runnerCityBg from '@/assets/images/runner-city-bg.png'
import runnerCityBg2 from '@/assets/images/runner-city-bg_2.png'
import runnerCityBg3 from '@/assets/images/runner-city-bg_3.png'
import runnerCityBg4 from '@/assets/images/runner-city-bg_4.png'
import runnerCityBg5 from '@/assets/images/runner-city-bg_5.png'
import runnerCityBg6 from '@/assets/images/runner-city-bg_6.png'
import { useRunnerInput } from '@/composables/runner/useRunnerInput'
import { useRunnerLoop } from '@/composables/runner/useRunnerLoop'
import { RUNNER_DEFAULT_STATE } from '@/engine/runner/constants'
import { RUNNER_VEHICLES } from '@/engine/runner/data/vehicles'
import { canActivateShield as canActivateRunnerShield } from '@/engine/runner/utils/state-mutations'
import { canUseEmergencyHeal, getVehicleById, getVehicleLaneSwitchMultiplier } from '@/engine/runner/utils/progression'
import { runnerAudioService } from '@/services/runnerAudio.service'
import type { RunnerFeedbackEvent } from '@/types/runner-game'
import type { LaneIndex, RunnerGameState } from '@/types/runner-state'

const router = useRouter()
const gameShellRef = ref<HTMLElement | null>(null)

const backgrounds: Record<string, string> = {
  'runner-city-bg.png': runnerCityBg,
  'runner-city-bg_2.png': runnerCityBg2,
  'runner-city-bg_3.png': runnerCityBg3,
  'runner-city-bg_4.png': runnerCityBg4,
  'runner-city-bg_5.png': runnerCityBg5,
  'runner-city-bg_6.png': runnerCityBg6
}

const gameState = reactive<RunnerGameState>(structuredClone(RUNNER_DEFAULT_STATE))
const showStartOverlay = ref(true)
const touchStartX = ref<number | null>(null)
const motionEnabled = ref(false)
const feedbackText = ref('')
const feedbackTone = ref<'positive' | 'neutral' | 'warning' | 'negative'>('positive')
const feedbackIcon = ref('!')
const flashTone = ref<'positive' | 'warning' | 'negative' | null>(null)

const ROAD_PROJECTION = {
  canvasWidth: 1536,
  canvasHeight: 1024,
  horizonY: 483.65,
  bottomY: 778.84,
  topLeftX: 748.82,
  topRightX: 785.51,
  bottomLeftX: 370.24,
  bottomRightX: 1164.09,
  roadCenterX: 767.17,
  roadHalfWidthFar: 18.35,
  roadHalfWidthNear: 396.93,
  laneCount: 3
} as const

const isPlaying = computed(() => gameState.status === 'running')
const showPauseOverlay = computed(() => {
  return gameState.status === 'paused' || gameState.status === 'victory' || gameState.status === 'gameover'
})
const statusLabel = computed(() => ({
  idle: 'Pronto',
  running: 'Correndo',
  paused: 'Pausado',
  victory: 'Vitoria',
  gameover: 'Game Over'
})[gameState.status])
const currentVehicle = computed(() => getVehicleById(gameState.meta.selectedVehicleId) ?? RUNNER_VEHICLES[0])
const currentVehicleEmoji = computed(() => currentVehicle.value?.emoji ?? '🛹')
const currentBackground = computed(() => backgrounds[gameState.roundProgress.currentRoundConfig.background] ?? runnerCityBg6)
const availableVehicles = computed(() => RUNNER_VEHICLES.filter((vehicle) => gameState.meta.unlockedVehicleIds.includes(vehicle.id)))
const progressPercent = computed(() => Math.min(100, Math.round((gameState.stats.distance / Math.max(1, gameState.stats.targetDistance)) * 100)))
const shieldChargePercent = computed(() => Math.min(100, Math.round((gameState.player.shieldCharge / Math.max(1, gameState.player.shieldChargeNeeded)) * 100)))
const formattedTime = computed(() => {
  const totalSeconds = Math.max(0, Math.ceil(gameState.stats.timeLeft))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})
const canActivateShield = computed(() => canActivateRunnerShield(gameState))
const canUseEmergencyHealNow = computed(() => {
  return canUseEmergencyHeal({
    currentLives: gameState.stats.lives,
    currentCoins: gameState.stats.coins,
    healCost: gameState.roundProgress.currentRoundConfig.emergencyHealCost,
    timeRemainingSeconds: gameState.stats.timeLeft,
    roundDurationSeconds: gameState.roundProgress.currentRoundConfig.durationSeconds,
    alreadyUsedEmergencyHeal: gameState.player.emergencyHealUsed
  }).allowed
})
const emergencyHealCostLabel = computed(() => `${gameState.roundProgress.currentRoundConfig.emergencyHealCost}c`)
const canSelectPreviousRound = computed(() => gameState.roundProgress.currentRound > 1)
const canSelectNextRound = computed(() => gameState.roundProgress.currentRound < gameState.meta.highestUnlockedRound)

const playerStyle = computed(() => {
  const leftX = ROAD_PROJECTION.topLeftX + (ROAD_PROJECTION.bottomLeftX - ROAD_PROJECTION.topLeftX)
  const rightX = ROAD_PROJECTION.topRightX + (ROAD_PROJECTION.bottomRightX - ROAD_PROJECTION.topRightX)
  const roadWidth = rightX - leftX
  const laneWidth = roadWidth / ROAD_PROJECTION.laneCount
  const xPx = leftX + laneWidth * (gameState.player.lane + 0.5)
  const laneMultiplier = getVehicleLaneSwitchMultiplier(gameState.player.vehicleId)

  return {
    left: `${(xPx / ROAD_PROJECTION.canvasWidth) * 100}%`,
    transitionDuration: `${Math.max(90, Math.round(180 / laneMultiplier))}ms`
  }
})

function getEntityStyle(lane: LaneIndex, depth: number) {
  const d = Math.min(Math.max(depth, 0), 1)
  const yPx = ROAD_PROJECTION.horizonY + (ROAD_PROJECTION.bottomY - ROAD_PROJECTION.horizonY) * d
  const leftX = ROAD_PROJECTION.topLeftX + (ROAD_PROJECTION.bottomLeftX - ROAD_PROJECTION.topLeftX) * d
  const rightX = ROAD_PROJECTION.topRightX + (ROAD_PROJECTION.bottomRightX - ROAD_PROJECTION.topRightX) * d
  const roadWidth = rightX - leftX
  const laneWidth = roadWidth / ROAD_PROJECTION.laneCount
  const xPx = leftX + laneWidth * (lane + 0.5)

  return {
    left: `${(xPx / ROAD_PROJECTION.canvasWidth) * 100}%`,
    top: `${(yPx / ROAD_PROJECTION.canvasHeight) * 100}%`,
    transform: `translate(-50%, -50%) scale(${0.34 + d * 1.34})`,
    opacity: String(0.7 + d * 0.3)
  }
}

function getRoadMarkerStyle(depth: number) {
  const d = Math.min(Math.max(depth, 0), 1)
  const yPx = ROAD_PROJECTION.horizonY + (ROAD_PROJECTION.bottomY - ROAD_PROJECTION.horizonY) * d
  const halfRoadWidth = ROAD_PROJECTION.roadHalfWidthFar + (ROAD_PROJECTION.roadHalfWidthNear - ROAD_PROJECTION.roadHalfWidthFar) * d

  return {
    left: `${(ROAD_PROJECTION.roadCenterX / ROAD_PROJECTION.canvasWidth) * 100}%`,
    top: `${(yPx / ROAD_PROJECTION.canvasHeight) * 100}%`,
    width: `${Math.max(4, halfRoadWidth * 0.1)}px`,
    height: `${8 + d * 36}px`,
    opacity: String(0.18 + d * 0.5),
    transform: 'translate(-50%, -50%)'
  }
}

function clearFeedbackLater() {
  window.setTimeout(() => {
    flashTone.value = null
  }, 180)

  window.setTimeout(() => {
    feedbackText.value = ''
  }, 1300)
}

function handleFeedback(event: RunnerFeedbackEvent) {
  feedbackText.value = event.text
  feedbackTone.value = event.tone
  feedbackIcon.value = event.icon ?? '!'
  flashTone.value = event.tone === 'negative' ? 'negative' : event.tone === 'warning' ? 'warning' : 'positive'
  runnerAudioService.playEvent(event)
  clearFeedbackLater()
}

const {
  start,
  pause,
  resume,
  reset,
  activateShield,
  useEmergencyHeal,
  selectRound,
  selectVehicle,
  advanceToNextRound,
  reloadPersistentProgress
} = useRunnerLoop(gameState, {
  onFeedback: handleFeedback,
  onRoundEnd: (summary) => {
    runnerAudioService.pauseMusic()
    runnerAudioService.playRoundOutcome(summary.completionStatus === 'victory')
  }
})

const { moveLeft, moveRight } = useRunnerInput(gameState, {
  onStart: () => startExperience(),
  onPauseToggle: () => {
    if (gameState.status === 'running') pauseRunner()
    else if (gameState.status === 'paused') resumeRunner()
  },
  onShield: () => useShield(),
  canMove: () => gameState.status === 'running',
  getLaneSwitchCooldownMs: () => Math.max(90, Math.round(140 / getVehicleLaneSwitchMultiplier(gameState.player.vehicleId)))
})

async function startExperience() {
  showStartOverlay.value = false
  await enterFullscreen()
  await lockPortraitOrientation()
  reloadPersistentProgress()
  runnerAudioService.playMusic(gameState.roundProgress.currentRound)

  if (gameState.status === 'idle') start()
  else if (gameState.status === 'paused') resume()
}

function restartExperience() {
  reset(gameState.roundProgress.currentRound)
  showStartOverlay.value = false
  runnerAudioService.playMusic(gameState.roundProgress.currentRound)
  start()
}

function startNextRound() {
  if (!advanceToNextRound()) return
  showStartOverlay.value = false
  runnerAudioService.playMusic(gameState.roundProgress.currentRound)
  start()
}

function returnToLoadout() {
  reset(gameState.roundProgress.currentRound)
  showStartOverlay.value = true
}

function pauseRunner() {
  pause()
  runnerAudioService.pauseMusic()
}

function resumeRunner() {
  resume()
  runnerAudioService.playMusic(gameState.roundProgress.currentRound)
}

function useShield() {
  activateShield()
}

function useHeal() {
  useEmergencyHeal()
}

function changeRound(direction: -1 | 1) {
  selectRound(gameState.roundProgress.currentRound + direction)
}

function chooseVehicle(vehicleId: string) {
  selectVehicle(vehicleId)
}

function onPauseOrResume() {
  if (gameState.status === 'running') pauseRunner()
  else if (gameState.status === 'paused') resumeRunner()
  else if (gameState.status === 'idle') startExperience()
}

async function exitRunner() {
  pause()
  runnerAudioService.stopMusic()
  await exitFullscreen()
  router.push('/hub')
}

function goHub() {
  runnerAudioService.stopMusic()
  router.push('/hub')
}

function getVehicleLabel(vehicleId: string) {
  return getVehicleById(vehicleId)?.name ?? vehicleId
}

function onTouchStart(event: TouchEvent) {
  touchStartX.value = event.changedTouches[0]?.clientX ?? null
}

function onTouchEnd(event: TouchEvent) {
  if (touchStartX.value === null) return

  const endX = event.changedTouches[0]?.clientX ?? 0
  const delta = endX - touchStartX.value

  if (Math.abs(delta) > 28) {
    if (delta > 0) moveRight()
    else moveLeft()
  }

  touchStartX.value = null
}

async function enterFullscreen() {
  try {
    const el = gameShellRef.value
    if (!el?.requestFullscreen) return
    await el.requestFullscreen({ navigationUI: 'hide' })
  } catch {
    //
  }
}

async function exitFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
  } catch {
    //
  }
}

async function lockPortraitOrientation() {
  try {
    const orientation = screen.orientation as ScreenOrientation & {
      lock?: (orientation: string) => Promise<void>
    }

    if (orientation?.lock) await orientation.lock('portrait')
  } catch {
    //
  }
}

async function enableMotionControl() {
  try {
    const maybeOrientation = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>
    }

    if (typeof maybeOrientation?.requestPermission === 'function') {
      motionEnabled.value = (await maybeOrientation.requestPermission()) === 'granted'
    } else {
      motionEnabled.value = true
    }
  } catch {
    motionEnabled.value = false
  }
}

function handleDeviceOrientation(event: DeviceOrientationEvent) {
  if (!motionEnabled.value || gameState.status !== 'running') return
  const gamma = event.gamma ?? 0
  if (gamma < -12) moveLeft()
  else if (gamma > 12) moveRight()
}

onMounted(() => {
  reloadPersistentProgress()
  window.addEventListener('deviceorientation', handleDeviceOrientation)
})

onBeforeUnmount(() => {
  window.removeEventListener('deviceorientation', handleDeviceOrientation)
  runnerAudioService.stopMusic()
})

watch(
  () => gameState.status,
  (status) => {
    if (status === 'running') runnerAudioService.playMusic(gameState.roundProgress.currentRound)
    else if (status === 'paused') runnerAudioService.pauseMusic()
    else if (status === 'idle') runnerAudioService.stopMusic()
  }
)
</script>

<style scoped>
.runner-mobile-shell { position: fixed; inset: 0; width: 100vw; height: 100dvh; overflow: hidden; background: #cfe8ff; touch-action: manipulation; user-select: none; }
.runner-mobile-stage { position: absolute; inset: 0; background-size: cover; background-position: center; background-repeat: no-repeat; }
.runner-stage-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(203,233,255,.22) 0%, rgba(255,255,255,.02) 38%, rgba(248,243,232,.18) 100%); z-index: 0; }
.runner-stage-ground-glow { position: absolute; left: 50%; bottom: 8dvh; width: 72%; height: 14dvh; transform: translateX(-50%); background: radial-gradient(circle, rgba(0,0,0,.16) 0%, rgba(0,0,0,0) 74%); filter: blur(20px); z-index: 0; }
.runner-hud { position: absolute; top: max(10px, env(safe-area-inset-top)); left: 0; right: 0; z-index: 20; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto; gap: 10px; padding: 12px 14px; }
.hud-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.hud-center, .runner-panel, .hud-pill, .hud-icon-btn { background: rgba(255,255,255,.9); box-shadow: 0 8px 18px rgba(0,0,0,.12); backdrop-filter: blur(10px); }
.hud-center { min-width: 0; border-radius: 22px; padding: 10px 12px; }
.hud-progress-top, .hud-progress-bottom, .shield-row { display: flex; justify-content: space-between; gap: 8px; font-size: .72rem; font-weight: 800; color: #344054; }
.hud-progress-top { margin-bottom: 6px; }
.hud-progress-bottom { margin-top: 6px; }
.shield-row { margin-top: 6px; align-items: center; }
.hud-progress-bar, .shield-bar { height: 8px; background: rgba(30,41,59,.12); border-radius: 999px; overflow: hidden; }
.hud-progress-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #31c48d 0%, #22c55e 100%); }
.shield-bar { flex: 1; }
.shield-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #60a5fa 0%, #2563eb 100%); }
.hud-pill, .hud-icon-btn { min-height: 42px; border: 0; border-radius: 999px; padding: 0 14px; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; }
.hud-pill.accent { color: #0f5fa8; background: rgba(230,247,255,.94); }
.hud-pill.subtle { color: #52616f; background: rgba(245,247,250,.94); }
.hud-icon-btn { min-width: 42px; cursor: pointer; padding: 0; }
.hud-icon-btn.danger { background: rgba(255,240,240,.95); }
.runner-status-overlay { position: absolute; top: calc(max(10px, env(safe-area-inset-top)) + 116px); left: 50%; transform: translateX(-50%); z-index: 15; display: grid; justify-items: center; gap: 6px; }
.status-pill, .status-caption, .entity-tag, .runner-chip, .start-stats span, .unlock-banner { border-radius: 999px; }
.status-pill { padding: 8px 14px; font-weight: 900; font-size: .82rem; box-shadow: 0 8px 18px rgba(0,0,0,.1); }
.status-caption { padding: 6px 12px; background: rgba(255,255,255,.82); font-size: .76rem; font-weight: 800; color: #405165; }
.status-pill.idle { background: #eef4ff; color: #385ec9; }
.status-pill.running { background: #ebfff2; color: #177245; }
.status-pill.paused { background: #fff7df; color: #8b6500; }
.status-pill.victory { background: #fff0d7; color: #9c5a00; }
.status-pill.gameover { background: #fff0f0; color: #9c2d2d; }
.runner-road { position: absolute; inset: 0; z-index: 1; }
.lane { position: absolute; top: 13%; bottom: 14%; width: 2px; background: linear-gradient(180deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,.42) 55%, rgba(255,255,255,.14) 100%); box-shadow: 0 0 8px rgba(255,255,255,.08); }
.lane-left { left: 33.33%; } .lane-center { left: 50%; } .lane-right { left: 66.66%; }
.road-marker { position: absolute; border-radius: 999px; background: linear-gradient(180deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.7) 100%); box-shadow: 0 0 10px rgba(255,255,255,.14), 0 2px 6px rgba(0,0,0,.08); z-index: 1; pointer-events: none; }
.road-edge-glow { position: absolute; top: 18%; bottom: 10%; width: 12px; pointer-events: none; z-index: 1; filter: blur(3px); opacity: .45; }
.road-edge-glow.left { left: 18%; background: linear-gradient(180deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.18) 45%, rgba(255,255,255,.08) 100%); }
.road-edge-glow.right { right: 18%; background: linear-gradient(180deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.18) 45%, rgba(255,255,255,.08) 100%); }
.runner-entity { position: absolute; display: grid; justify-items: center; gap: 4px; line-height: 1; pointer-events: none; will-change: transform, top, left; z-index: 2; }
.entity-icon { font-size: 2rem; filter: drop-shadow(0 6px 8px rgba(0,0,0,.18)) drop-shadow(0 0 6px rgba(255,255,255,.06)); }
.entity-tag { padding: 4px 8px; font-size: .58rem; font-weight: 900; white-space: nowrap; letter-spacing: .02em; }
.entity-tag.special { background: rgba(254,240,138,.96); color: #92400e; }
.entity-tag.risky { background: rgba(191,219,254,.96); color: #1d4ed8; }
.entity-tag.bad { background: rgba(254,205,211,.96); color: #be123c; }
.runner-entity.collectible.good .entity-icon { filter: drop-shadow(0 0 14px rgba(74,222,128,.48)) drop-shadow(0 6px 8px rgba(0,0,0,.18)); }
.runner-entity.collectible.risky .entity-icon { filter: drop-shadow(0 0 14px rgba(96,165,250,.48)) drop-shadow(0 6px 8px rgba(0,0,0,.18)); }
.runner-entity.collectible.special .entity-icon { filter: drop-shadow(0 0 16px rgba(251,191,36,.58)) drop-shadow(0 6px 8px rgba(0,0,0,.18)); }
.runner-entity.collectible.bad .entity-icon { filter: drop-shadow(0 0 12px rgba(244,114,182,.44)) drop-shadow(0 6px 8px rgba(0,0,0,.18)); }
.runner-entity.obstacle.minor .entity-icon { filter: drop-shadow(0 0 14px rgba(251,191,36,.38)) drop-shadow(0 6px 8px rgba(0,0,0,.18)); }
.runner-entity.obstacle.major .entity-icon { filter: drop-shadow(0 0 16px rgba(248,113,113,.42)) drop-shadow(0 6px 8px rgba(0,0,0,.18)); }
.runner-player { position: absolute; bottom: 16%; font-size: clamp(2.8rem, 8vw, 4rem); transform: translate(-50%, 0); transition-property: left, transform; transition-timing-function: cubic-bezier(.22,.61,.36,1); filter: drop-shadow(0 10px 12px rgba(0,0,0,.24)) drop-shadow(0 0 10px rgba(255,255,255,.08)); z-index: 4; }
.runner-player.shield { filter: drop-shadow(0 0 16px rgba(67,214,126,.9)) drop-shadow(0 8px 10px rgba(0,0,0,.22)); }
.runner-flash { position: absolute; inset: 0; z-index: 8; pointer-events: none; }
.runner-flash.positive { background: radial-gradient(circle, rgba(67,214,126,.22) 0%, rgba(67,214,126,.08) 45%, rgba(67,214,126,0) 75%); }
.runner-flash.warning { background: radial-gradient(circle, rgba(255,189,89,.24) 0%, rgba(255,189,89,.08) 45%, rgba(255,189,89,0) 75%); }
.runner-flash.negative { background: radial-gradient(circle, rgba(255,97,97,.28) 0%, rgba(255,97,97,.1) 45%, rgba(255,97,97,0) 75%); }
.runner-feedback-text { position: absolute; top: calc(max(10px, env(safe-area-inset-top)) + 148px); left: 50%; transform: translateX(-50%); z-index: 25; display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 999px; font-weight: 900; font-size: .92rem; box-shadow: 0 8px 18px rgba(0,0,0,.12); max-width: min(90vw, 540px); text-align: center; }
.runner-feedback-text.positive, .runner-feedback-text.neutral { background: #ebfff2; color: #177245; }
.runner-feedback-text.warning { background: #fff8e2; color: #9a6700; }
.runner-feedback-text.negative { background: #fff0f0; color: #9c2d2d; }
.runner-start-overlay, .runner-modal-overlay { position: absolute; inset: 0; z-index: 30; display: grid; place-items: center; padding: 24px; background: rgba(8,15,30,.28); backdrop-filter: blur(8px); }
.runner-panel { width: min(94vw, 540px); border-radius: 28px; padding: 24px; text-align: center; }
.runner-chip { display: inline-flex; align-items: center; background: #eaf3ff; color: #315ea8; padding: 8px 14px; font-size: .82rem; font-weight: 800; margin-bottom: 14px; }
.runner-panel h1, .runner-panel h2 { margin: 0 0 10px; font-size: 1.7rem; font-weight: 900; color: #2f3241; }
.runner-panel p { margin: 0 0 16px; color: #5f6679; font-weight: 600; line-height: 1.45; }
.selector-row { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center; margin-bottom: 16px; }
.selector-btn { width: 42px; height: 42px; border: 0; border-radius: 999px; background: #edf5ff; color: #2d5baf; font-weight: 900; }
.selector-summary, .goal-grid div, .result-grid div, .final-card { background: #f8fafc; border-radius: 18px; }
.selector-summary { display: grid; gap: 4px; justify-items: center; padding: 12px 14px; }
.selector-summary span { font-weight: 800; color: #31455b; }
.selector-summary small, .goal-grid span, .final-card small { color: #66768a; line-height: 1.35; }
.start-stats, .vehicle-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 18px; }
.start-stats span { background: #f4f7fb; padding: 8px 12px; font-size: .8rem; font-weight: 800; }
.vehicle-chip { border: 0; border-radius: 16px; background: #f4f7fb; color: #31455b; padding: 10px 12px; display: inline-flex; align-items: center; gap: 8px; font-weight: 800; }
.vehicle-chip.active { background: #e9fff0; color: #177245; box-shadow: inset 0 0 0 2px rgba(23,114,69,.18); }
.goal-grid, .pause-actions { display: grid; gap: 10px; }
.goal-grid { margin-bottom: 18px; text-align: left; }
.goal-grid div { padding: 12px 14px; display: grid; gap: 4px; }
.goal-grid strong { color: #1f2f43; }
.result-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 16px; }
.result-grid div { padding: 12px; display: grid; gap: 4px; }
.result-grid strong { color: #334155; font-size: .8rem; }
.result-grid span { color: #0f172a; font-weight: 900; }
.final-card { display: grid; grid-template-columns: auto 1fr; gap: 12px; text-align: left; padding: 14px; }
.final-card-icon { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 16px; background: #eaf3ff; font-size: 1.6rem; }
.unlock-banner { margin-top: 16px; padding: 12px 14px; background: #fff8dd; color: #8b6500; font-weight: 800; }
.primary-cta, .secondary-cta, .ghost-cta { width: 100%; min-height: 52px; border-radius: 18px; border: 0; font-weight: 900; cursor: pointer; }
.primary-cta { background: #1fba74; color: #fff; }
.secondary-cta { background: #edf5ff; color: #2d5baf; }
.ghost-cta { background: transparent; color: #49566d; border: 2px solid rgba(73,86,109,.18); }
.runner-controls { position: absolute; left: 0; right: 0; bottom: calc(18px + env(safe-area-inset-bottom)); z-index: 22; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; padding: 0 18px; }
.control-btn { min-height: 70px; border: 0; border-radius: 24px; background: rgba(255,255,255,.92); box-shadow: 0 12px 24px rgba(0,0,0,.16); font-size: 1.2rem; font-weight: 900; backdrop-filter: blur(10px); display: grid; place-items: center; gap: 2px; padding: 8px 10px; }
.control-btn span { font-size: .92rem; }
.control-btn small { font-size: .72rem; opacity: .74; }
.control-btn.shield { background: rgba(233,243,255,.96); color: #1d4ed8; }
.control-btn.heal { background: rgba(236,253,245,.96); color: #177245; }
.control-btn:disabled, .selector-btn:disabled { opacity: .45; }
@media (max-width: 960px) { .runner-hud { grid-template-columns: 1fr; } .runner-status-overlay { top: calc(max(10px, env(safe-area-inset-top)) + 164px); } }
@media (max-width: 640px) { .runner-controls { grid-template-columns: repeat(2, minmax(0, 1fr)); } .result-grid { grid-template-columns: 1fr; } .final-card { grid-template-columns: 1fr; justify-items: center; text-align: center; } .runner-panel { width: min(94vw, 440px); padding: 22px 18px; } }
</style>
