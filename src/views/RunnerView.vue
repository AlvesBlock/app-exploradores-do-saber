<template>
  <div
    ref="gameShellRef"
    class="runner-mobile-shell"
    :class="[
      `status-${gameState.status}`,
      { 'is-playing': isPlaying, 'sensor-enabled': motionEnabled }
    ]"
  >
    <div class="runner-mobile-stage" :style="{ backgroundImage: `url(${runnerCityBg})` }">
      <div class="runner-stage-overlay"></div>
      <div class="runner-stage-ground-glow"></div>

      <div v-if="collectFlash" class="runner-flash collect"></div>
      <div v-if="hitFlash" class="runner-flash hit"></div>

      <div v-if="feedbackText" class="runner-feedback-text" :class="feedbackType">
        {{ feedbackText }}
      </div>

      <!-- HUD -->
      <header class="runner-hud">
        <div class="hud-left">
          <div class="hud-pill">❤️ {{ gameState.stats.lives }}</div>
          <div class="hud-pill">🪙 {{ gameState.stats.coins }}</div>
        </div>

        <div class="hud-center">
          <div class="hud-progress-top">
            <span>♻️ {{ gameState.stats.collectedCount }}/{{ gameState.stats.minCollectibles }}</span>
            <span>{{ Math.floor(gameState.stats.distance) }}/{{ gameState.stats.targetDistance }}</span>
          </div>
          <div class="hud-progress-bar">
            <div class="hud-progress-fill" :style="{ width: `${progressPercent}%` }"></div>
          </div>
        </div>

        <div class="hud-right">
          <button class="hud-icon-btn" @click="onPauseOrResume">
            <span v-if="gameState.status === 'running'">⏸️</span>
            <span v-else>▶️</span>
          </button>

          <button class="hud-icon-btn danger" @click="exitRunner">
            ✕
          </button>
        </div>
      </header>

      <!-- Status -->
      <div class="runner-status-overlay">
        <span class="status-pill" :class="gameState.status">
          {{ statusLabel }}
        </span>
      </div>

      <!-- Pista -->
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
          :class="entity.type"
          :style="getEntityStyle(entity.lane, entity.depth)"
        >
          {{ entity.emoji }}
        </div>

        <div
          class="runner-player"
          :class="{ turbo: gameState.player.turboActive }"
          :style="playerStyle"
        >
          {{ currentVehicle }}
        </div>
      </div>

      <!-- Overlay inicial -->
      <div v-if="showStartOverlay" class="runner-start-overlay">
        <div class="start-card">
          <div class="runner-chip">Modo Arcade</div>
          <h1>Runner da Reciclagem</h1>
          <p>
            Corra, colete recicláveis e desvie dos obstáculos.
          </p>

          <div class="start-stats">
            <span>❤️ {{ gameState.stats.lives }} vidas</span>
            <span>🚀 Turbo por carga</span>
            <span>♻️ Meta: {{ gameState.stats.minCollectibles }}</span>
          </div>

          <button class="primary-cta" @click="startExperience">
            Jogar agora
          </button>

          <button class="secondary-cta" @click="enableMotionControl">
            {{ motionEnabled ? 'Sensor ativado' : 'Ativar controle por movimento' }}
          </button>

          <button class="ghost-cta" @click="goHub">
            Voltar ao hub
          </button>
        </div>
      </div>

      <!-- Overlay pausa/fim -->
      <div v-if="showPauseOverlay" class="runner-modal-overlay">
        <div class="pause-card">
          <h2 v-if="gameState.status === 'paused'">Jogo pausado</h2>
          <h2 v-else-if="gameState.status === 'victory'">Vitória!</h2>
          <h2 v-else-if="gameState.status === 'gameover'">Game Over</h2>

          <p v-if="gameState.status === 'paused'">
            Continue quando estiver pronto.
          </p>
          <p v-else-if="gameState.status === 'victory'">
            Você completou a corrida e coletou recicláveis suficientes.
          </p>
          <p v-else-if="gameState.status === 'gameover'">
            Você perdeu todas as vidas ou ficou sem tempo.
          </p>

          <div class="pause-actions">
            <button v-if="gameState.status === 'paused'" class="primary-cta" @click="resumeRunner">
              Continuar
            </button>

            <button v-if="gameState.status === 'victory' || gameState.status === 'gameover'" class="primary-cta" @click="restartExperience">
              Jogar novamente
            </button>

            <button class="secondary-cta" @click="exitRunner">
              Sair
            </button>
          </div>
        </div>
      </div>

      <!-- Controles -->
      <div v-if="isPlaying" class="runner-controls">
        <button class="control-btn left" @touchstart.prevent="moveLeft" @click="moveLeft">
          ←
        </button>

        <button
          class="control-btn center turbo"
          :disabled="!canTurbo"
          @touchstart.prevent="useTurbo"
          @click="useTurbo"
        >
          ⚡
        </button>

        <button class="control-btn right" @touchstart.prevent="moveRight" @click="moveRight">
          →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import runnerCityBg from '@/assets/images/runner-city-bg.png'
import { runnerAudioService } from '@/services/runnerAudio.service'
import { useRunnerInput } from '@/composables/runner/useRunnerInput'
import { useRunnerLoop } from '@/composables/runner/useRunnerLoop'
import { RUNNER_DEFAULT_STATE, VEHICLE_STAGES, VEHICLE_UPGRADE_COSTS } from '@/engine/runner/constants'
import type { LaneIndex } from '@/types/runner'

const router = useRouter()
const gameShellRef = ref<HTMLElement | null>(null)

const gameState = reactive(structuredClone(RUNNER_DEFAULT_STATE))

const collectFlash = ref(false)
const hitFlash = ref(false)
const feedbackText = ref('')
const feedbackType = ref<'collect' | 'hit'>('collect')

const showStartOverlay = ref(true)
const touchStartX = ref<number | null>(null)
const motionEnabled = ref(false)
const fullscreenActive = ref(false)

const isPlaying = computed(() => {
  return gameState.status === 'running'
})

const showPauseOverlay = computed(() => {
  return gameState.status === 'paused' || gameState.status === 'victory' || gameState.status === 'gameover'
})

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

const statusLabel = computed(() => {
  const map = {
    idle: 'Pronto',
    running: 'Correndo',
    paused: 'Pausado',
    victory: 'Vitória',
    gameover: 'Game Over'
  } as const

  return map[gameState.status]
})

const progressPercent = computed(() => {
  return Math.min(
    100,
    Math.round((gameState.stats.distance / gameState.stats.targetDistance) * 100)
  )
})

const currentVehicle = computed(() => {
  return VEHICLE_STAGES[gameState.player.vehicleLevel] ?? '🛹'
})

const nextUpgradeCost = computed(() => {
  const nextLevel = gameState.player.vehicleLevel + 1
  return VEHICLE_UPGRADE_COSTS[nextLevel] ?? null
})

const canTurbo = computed(() => {
  return (gameState.player.turboCharge ?? 0) >= 10 && !gameState.player.turboActive
})

const playerStyle = computed(() => {
  const {
    canvasWidth,
    topLeftX,
    topRightX,
    bottomLeftX,
    bottomRightX,
    laneCount
  } = ROAD_PROJECTION

  const d = 1
  const leftX = topLeftX + (bottomLeftX - topLeftX) * d
  const rightX = topRightX + (bottomRightX - topRightX) * d
  const roadWidth = rightX - leftX
  const laneWidth = roadWidth / laneCount
  const xPx = leftX + laneWidth * (gameState.player.lane + 0.5)
  const leftPercent = (xPx / canvasWidth) * 100

  return { left: `${leftPercent}%` }
})

function getEntityStyle(lane: LaneIndex, depth: number) {
  const d = Math.min(Math.max(depth, 0), 1)

  const {
    canvasWidth,
    canvasHeight,
    horizonY,
    bottomY,
    topLeftX,
    topRightX,
    bottomLeftX,
    bottomRightX,
    laneCount
  } = ROAD_PROJECTION

  const yPx = horizonY + (bottomY - horizonY) * d
  const leftX = topLeftX + (bottomLeftX - topLeftX) * d
  const rightX = topRightX + (bottomRightX - topRightX) * d
  const roadWidth = rightX - leftX
  const laneWidth = roadWidth / laneCount
  const xPx = leftX + laneWidth * (lane + 0.5)

  const leftPercent = (xPx / canvasWidth) * 100
  const topPercent = (yPx / canvasHeight) * 100
  const scale = 0.38 + d * 1.45
  const opacity = 0.7 + d * 0.3

  return {
    left: `${leftPercent}%`,
    top: `${topPercent}%`,
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity: String(opacity)
  }
}

function getRoadMarkerStyle(depth: number) {
  const d = Math.min(Math.max(depth, 0), 1)

  const {
    canvasWidth,
    canvasHeight,
    horizonY,
    bottomY,
    roadCenterX,
    roadHalfWidthFar,
    roadHalfWidthNear
  } = ROAD_PROJECTION

  const yPx = horizonY + (bottomY - horizonY) * d
  const halfRoadWidth = roadHalfWidthFar + (roadHalfWidthNear - roadHalfWidthFar) * d
  const markerWidth = Math.max(4, halfRoadWidth * 0.1)
  const markerHeight = 8 + d * 42
  const opacity = 0.2 + d * 0.55

  return {
    left: `${(roadCenterX / canvasWidth) * 100}%`,
    top: `${(yPx / canvasHeight) * 100}%`,
    width: `${markerWidth}px`,
    height: `${markerHeight}px`,
    opacity: String(opacity),
    transform: 'translate(-50%, -50%)'
  }
}

function triggerCollectFeedback() {
  runnerAudioService.playCollect()
  collectFlash.value = true
  feedbackText.value = '+1 moeda'
  feedbackType.value = 'collect'

  window.setTimeout(() => (collectFlash.value = false), 180)
  window.setTimeout(() => {
    if (feedbackType.value === 'collect') feedbackText.value = ''
  }, 700)
}

function triggerHitFeedback() {
  runnerAudioService.playHit()
  hitFlash.value = true
  feedbackText.value = '-1 vida'
  feedbackType.value = 'hit'

  window.setTimeout(() => (hitFlash.value = false), 220)
  window.setTimeout(() => {
    if (feedbackType.value === 'hit') feedbackText.value = ''
  }, 700)
}

const { start, pause, resume, reset, activateTurbo, upgradeVehicle } = useRunnerLoop(gameState, {
  onCollect: triggerCollectFeedback,
  onHit: triggerHitFeedback
})

const { moveLeft, moveRight } = useRunnerInput(gameState, {
  onStart: () => {
    if (gameState.status === 'idle') {
      start()
    } else if (gameState.status === 'paused') {
      resume()
    }
  },
  onPauseToggle: () => {
    if (gameState.status === 'running') pause()
    else if (gameState.status === 'paused') resume()
  }
})

async function startExperience() {
  showStartOverlay.value = false
  await enterFullscreen()
  await lockPortraitOrientation()

  if (gameState.status === 'idle') {
    start()
  } else if (gameState.status === 'paused') {
    resume()
  }
}

function restartExperience() {
  reset()
  showStartOverlay.value = false
  start()
}

function pauseRunner() {
  pause()
}

function resumeRunner() {
  resume()
}

function useTurbo() {
  activateTurbo()
}

function onPauseOrResume() {
  if (gameState.status === 'running') {
    pauseRunner()
  } else if (gameState.status === 'paused') {
    resumeRunner()
  } else if (gameState.status === 'idle') {
    startExperience()
  }
}

function resetRunner() {
  reset()
  showStartOverlay.value = true
}

async function exitRunner() {
  pause()
  await exitFullscreen()
  router.push('/hub')
}

function goHub() {
  router.push('/hub')
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
    fullscreenActive.value = true
  } catch {
    fullscreenActive.value = false
  }
}

async function exitFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    }
  } catch {
    //
  } finally {
    fullscreenActive.value = false
  }
}

async function lockPortraitOrientation() {
  try {
    const orientation = screen.orientation as ScreenOrientation & {
      lock?: (orientation: string) => Promise<void>
    }

    if (orientation?.lock) {
      await orientation.lock('portrait')
    }
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
      const result = await maybeOrientation.requestPermission()
      motionEnabled.value = result === 'granted'
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

  if (gamma < -12) {
    moveLeft()
  } else if (gamma > 12) {
    moveRight()
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') moveLeft()
  if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') moveRight()
  if (event.key === 'Enter') startExperience()
  if (event.key.toLowerCase() === 'p') onPauseOrResume()
  if (event.key === ' ') useTurbo()
}

onMounted(() => {
  window.addEventListener('deviceorientation', handleDeviceOrientation)
  window.addEventListener('keydown', handleKeydown)

  document.addEventListener('fullscreenchange', () => {
    fullscreenActive.value = !!document.fullscreenElement
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('deviceorientation', handleDeviceOrientation)
  window.removeEventListener('keydown', handleKeydown)
})

watch(
  () => [gameState.status, gameState.stats.coins],
  () => {
    if (nextUpgradeCost.value !== null && gameState.stats.coins >= nextUpgradeCost.value) {
      upgradeVehicle(nextUpgradeCost.value)
    }
  }
)
</script>

<style scoped>
.runner-mobile-shell {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  background: #cfe8ff;
  touch-action: manipulation;
  user-select: none;
}

.runner-mobile-stage {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.runner-stage-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(210, 235, 255, 0.26) 0%,
    rgba(255, 255, 255, 0.03) 38%,
    rgba(250, 244, 232, 0.14) 100%
  );
  z-index: 0;
}

.runner-stage-ground-glow {
  position: absolute;
  left: 50%;
  bottom: 10dvh;
  width: 72%;
  height: 12dvh;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(0, 0, 0, 0.16) 0%, rgba(0, 0, 0, 0) 72%);
  filter: blur(20px);
  z-index: 0;
}

.runner-hud {
  position: absolute;
  top: max(10px, env(safe-area-inset-top));
  left: 0;
  right: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: 10px;
  padding: 12px 14px;
}

.hud-left,
.hud-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hud-center {
  min-width: 0;
  background: rgba(255, 255, 255, 0.82);
  border-radius: 999px;
  padding: 8px 10px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
}

.hud-progress-top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.72rem;
  font-weight: 800;
  color: #344054;
  margin-bottom: 6px;
}

.hud-progress-bar {
  height: 8px;
  background: rgba(30, 41, 59, 0.12);
  border-radius: 999px;
  overflow: hidden;
}

.hud-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #31c48d 0%, #22c55e 100%);
}

.hud-pill,
.hud-icon-btn {
  height: 42px;
  min-width: 42px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  backdrop-filter: blur(10px);
}

.hud-icon-btn {
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
}

.hud-icon-btn.danger {
  background: rgba(255, 240, 240, 0.95);
}

.runner-status-overlay {
  position: absolute;
  top: calc(max(10px, env(safe-area-inset-top)) + 74px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
}

.status-pill {
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 900;
  font-size: 0.82rem;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
}

.status-pill.idle {
  background: #eef4ff;
  color: #385ec9;
}

.status-pill.running {
  background: #ebfff2;
  color: #177245;
}

.status-pill.paused {
  background: #fff7df;
  color: #8b6500;
}

.status-pill.victory {
  background: #fff0d7;
  color: #9c5a00;
}

.status-pill.gameover {
  background: #fff0f0;
  color: #9c2d2d;
}

.runner-road {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.lane {
  position: absolute;
  top: 13%;
  bottom: 14%;
  width: 2px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(255, 255, 255, 0.45) 55%,
    rgba(255, 255, 255, 0.16) 100%
  );
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.08);
}

.lane-left { left: 33.33%; }
.lane-center { left: 50%; }
.lane-right { left: 66.66%; }

.road-marker {
  position: absolute;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255,255,255,.92) 0%, rgba(255,255,255,.72) 100%);
  box-shadow: 0 0 10px rgba(255,255,255,.14), 0 2px 6px rgba(0,0,0,.08);
  z-index: 1;
  pointer-events: none;
}

.road-edge-glow {
  position: absolute;
  top: 18%;
  bottom: 10%;
  width: 12px;
  pointer-events: none;
  z-index: 1;
  filter: blur(3px);
  opacity: .45;
}

.road-edge-glow.left {
  left: 18%;
  background: linear-gradient(180deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.18) 45%, rgba(255,255,255,.08) 100%);
}

.road-edge-glow.right {
  right: 18%;
  background: linear-gradient(180deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.18) 45%, rgba(255,255,255,.08) 100%);
}

.runner-entity {
  position: absolute;
  font-size: 2rem;
  line-height: 1;
  pointer-events: none;
  will-change: transform, top, left;
  filter: drop-shadow(0 6px 8px rgba(0,0,0,.18)) drop-shadow(0 0 6px rgba(255,255,255,.06));
  z-index: 2;
}

.runner-player {
  position: absolute;
  bottom: 16%;
  font-size: clamp(2.6rem, 8vw, 4rem);
  transform: translate(-50%, 0);
  transition: left .16s ease, transform .12s ease;
  filter: drop-shadow(0 10px 12px rgba(0,0,0,.24)) drop-shadow(0 0 10px rgba(255,255,255,.08));
  z-index: 4;
}

.runner-player.turbo {
  filter: drop-shadow(0 0 16px rgba(255,196,0,.9)) drop-shadow(0 8px 10px rgba(0,0,0,.22));
}

.runner-flash {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
}

.runner-flash.collect {
  background: radial-gradient(circle, rgba(67,214,126,.22) 0%, rgba(67,214,126,.08) 45%, rgba(67,214,126,0) 75%);
}

.runner-flash.hit {
  background: radial-gradient(circle, rgba(255,97,97,.28) 0%, rgba(255,97,97,.1) 45%, rgba(255,97,97,0) 75%);
}

.runner-feedback-text {
  position: absolute;
  top: calc(max(10px, env(safe-area-inset-top)) + 110px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 25;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 900;
  font-size: .95rem;
  box-shadow: 0 8px 18px rgba(0,0,0,.12);
}

.runner-feedback-text.collect {
  background: #ebfff2;
  color: #177245;
}

.runner-feedback-text.hit {
  background: #fff0f0;
  color: #9c2d2d;
}

.runner-start-overlay,
.runner-modal-overlay {
  position: absolute;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(8, 15, 30, 0.28);
  backdrop-filter: blur(8px);
}

.start-card,
.pause-card {
  width: min(92vw, 420px);
  border-radius: 28px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 20px 50px rgba(0,0,0,.18);
  padding: 24px;
  text-align: center;
}

.runner-chip {
  display: inline-flex;
  align-items: center;
  background: #eaf3ff;
  color: #315ea8;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: .82rem;
  font-weight: 800;
  margin-bottom: 14px;
}

.start-card h1,
.pause-card h2 {
  margin: 0 0 10px;
  font-size: 1.7rem;
  font-weight: 900;
  color: #2f3241;
}

.start-card p,
.pause-card p {
  margin: 0 0 16px;
  color: #5f6679;
  font-weight: 600;
  line-height: 1.4;
}

.start-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 18px;
}

.start-stats span {
  background: #f4f7fb;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: .8rem;
  font-weight: 800;
}

.pause-actions {
  display: grid;
  gap: 10px;
}

.primary-cta,
.secondary-cta,
.ghost-cta {
  width: 100%;
  min-height: 52px;
  border-radius: 18px;
  border: 0;
  font-weight: 900;
  cursor: pointer;
}

.primary-cta {
  background: #1fba74;
  color: #fff;
}

.secondary-cta {
  background: #edf5ff;
  color: #2d5baf;
}

.ghost-cta {
  background: transparent;
  color: #49566d;
  border: 2px solid rgba(73,86,109,.18);
}

.runner-controls {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(18px + env(safe-area-inset-bottom));
  z-index: 22;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: 14px;
  padding: 0 18px;
}

.control-btn {
  height: 68px;
  border: 0;
  border-radius: 999px;
  background: rgba(255,255,255,.9);
  box-shadow: 0 12px 24px rgba(0,0,0,.16);
  font-size: 1.6rem;
  font-weight: 900;
  backdrop-filter: blur(10px);
}

.control-btn.left,
.control-btn.right {
  width: 100%;
}

.control-btn.center {
  width: 68px;
}

.control-btn.turbo:disabled {
  opacity: .45;
}

@media (min-width: 768px) {
  .runner-controls {
    max-width: 540px;
    margin: 0 auto;
  }

  .runner-player {
    bottom: 14%;
  }
}
</style>