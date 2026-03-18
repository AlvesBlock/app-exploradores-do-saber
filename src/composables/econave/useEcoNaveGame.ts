import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import { ECONAVE_STAGES } from '@/engine/econave/data/stages'
import { ECONAVE_SHIPS } from '@/engine/econave/data/ships'
import {
  activateEcoNavePulse,
  pauseEcoNaveRuntime,
  resumeEcoNaveRuntime,
  startEcoNaveStage,
  stepEcoNaveRuntime
} from '@/engine/econave/runtime/simulation'
import { createHudSnapshot } from '@/engine/econave/runtime/state'
import { econaveAudioService } from '@/services/econaveAudio.service'
import { econaveProgressService } from '@/services/econaveProgress.service'
import type {
  EcoNaveHudSnapshot,
  EcoNavePreferences,
  EcoNaveRuntimeFeedback,
  EcoNaveRuntimeState,
  EcoNaveShipId,
  EcoNaveStageId,
  EcoNaveStageResult
} from '@/types/econave'

const EMPTY_HUD: EcoNaveHudSnapshot = {
  status: 'menu',
  score: 0,
  combo: 0,
  energy: 0,
  maxEnergy: 0,
  pulseCharges: 0,
  timeLeftSeconds: 0,
  collectedCorrect: 0,
  collectTarget: 0,
  neutralizedHazards: 0,
  neutralizeTarget: 0,
  protectedSatellites: 0,
  protectTarget: 0,
  ecoScore: 0,
  ecoScoreTarget: 0,
  bossHp: 0,
  bossMaxHp: 0,
  activeEffects: {
    magnetMs: 0,
    classifierMs: 0,
    turboMs: 0,
    slowMs: 0
  }
}

export function useEcoNaveGame() {
  const progress = ref(econaveProgressService.get())
  const runtimeState = shallowRef<EcoNaveRuntimeState | null>(null)
  const selectedStageId = ref<EcoNaveStageId>('earth_orbit')
  const currentResult = ref<EcoNaveStageResult | null>(null)
  const latestFeedback = ref<EcoNaveRuntimeFeedback | null>(null)
  const hud = ref<EcoNaveHudSnapshot>(EMPTY_HUD)
  const isRunning = ref(false)
  const isPaused = ref(false)

  const inputState = {
    moveX: 0,
    moveY: 0,
    firePressed: false
  }

  let frameId: number | null = null
  let lastTime = 0
  let hudAccumulator = 0

  const selectedStage = computed(
    () => ECONAVE_STAGES.find((stage) => stage.id === selectedStageId.value) ?? ECONAVE_STAGES[0]!,
  )
  const selectedShip = computed(
    () =>
      ECONAVE_SHIPS.find((ship) => ship.id === progress.value.selectedShipId) ?? ECONAVE_SHIPS[0]!,
  )
  const stageProgress = computed(() => progress.value.stages[selectedStageId.value])
  const unlockedStageCount = computed(
    () => Object.values(progress.value.stages).filter((stage) => stage.unlocked).length,
  )

  function syncProgress() {
    progress.value = econaveProgressService.get()
  }

  function stopLoop() {
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
  }

  function refreshHud(force = false) {
    if (!runtimeState.value) {
      hud.value = EMPTY_HUD
      return
    }

    if (force || hudAccumulator >= 80) {
      hud.value = createHudSnapshot(runtimeState.value)
      hudAccumulator = 0
    }
  }

  function processEvents(events: ReturnType<typeof stepEcoNaveRuntime>) {
    events.forEach((event) => {
      if (event.kind === 'feedback' && event.feedback) {
        latestFeedback.value = event.feedback
        econaveAudioService.playCue(event.feedback.cue)
      }

      if (event.kind === 'result' && event.result) {
        currentResult.value = event.result
        syncProgress()
        isRunning.value = false
        isPaused.value = false
        econaveAudioService.stopMusic()
      }
    })

    refreshHud(true)
  }

  function tick(now: number) {
    const state = runtimeState.value
    if (!state || state.status !== 'running') {
      stopLoop()
      isRunning.value = false
      return
    }

    const deltaMs = lastTime ? now - lastTime : 16
    lastTime = now
    hudAccumulator += deltaMs
    processEvents(
      stepEcoNaveRuntime(state, inputState, deltaMs, (result) =>
        econaveProgressService.applyStageResult(result),
      ),
    )
    refreshHud()

    if (state.status === 'running') {
      frameId = requestAnimationFrame(tick)
    } else {
      stopLoop()
      isRunning.value = false
    }
  }

  function startStage(stageId = selectedStageId.value) {
    const stageStatus = progress.value.stages[stageId]
    if (!stageStatus?.unlocked) {
      return false
    }

    selectedStageId.value = stageId
    currentResult.value = null
    latestFeedback.value = null
    econaveAudioService.applySettings(progress.value.settings)
    econaveAudioService.unlock()
    econaveAudioService.stopMusic()

    runtimeState.value = startEcoNaveStage(
      stageId,
      progress.value.selectedShipId,
      progress.value.settings.quality,
    )

    hud.value = createHudSnapshot(runtimeState.value)
    isRunning.value = true
    isPaused.value = false
    lastTime = 0
    hudAccumulator = 0
    econaveAudioService.startMusic(runtimeState.value.stageConfig.soundtrack)
    stopLoop()
    frameId = requestAnimationFrame(tick)
    return true
  }

  function pauseStage() {
    if (!runtimeState.value || runtimeState.value.status !== 'running') {
      return
    }

    pauseEcoNaveRuntime(runtimeState.value)
    isRunning.value = false
    isPaused.value = true
    econaveAudioService.pause()
    stopLoop()
    refreshHud(true)
  }

  function resumeStage() {
    if (!runtimeState.value || runtimeState.value.status !== 'paused') {
      return
    }

    resumeEcoNaveRuntime(runtimeState.value)
    isRunning.value = true
    isPaused.value = false
    econaveAudioService.resume()
    lastTime = 0
    frameId = requestAnimationFrame(tick)
  }

  function restartStage() {
    return startStage(selectedStageId.value)
  }

  function leaveStage() {
    stopLoop()
    econaveAudioService.stopMusic()
    runtimeState.value = null
    currentResult.value = null
    latestFeedback.value = null
    isRunning.value = false
    isPaused.value = false
    hud.value = EMPTY_HUD
  }

  function setMovement(x: number, y: number) {
    inputState.moveX = x
    inputState.moveY = y
  }

  function stopMovement() {
    inputState.moveX = 0
    inputState.moveY = 0
  }

  function setFirePressed(active: boolean) {
    inputState.firePressed = active
  }

  function triggerPulse() {
    if (!runtimeState.value) {
      return
    }

    processEvents(
      activateEcoNavePulse(runtimeState.value, (result) => econaveProgressService.applyStageResult(result)),
    )
  }

  function selectShip(shipId: EcoNaveShipId) {
    progress.value = econaveProgressService.selectShip(shipId)
    econaveAudioService.applySettings(progress.value.settings)
  }

  function selectStageCard(stageId: EcoNaveStageId) {
    if (isRunning.value) {
      return
    }

    selectedStageId.value = stageId
  }

  function updateSettings(partial: Partial<EcoNavePreferences>) {
    progress.value = econaveProgressService.updateSettings(partial)
    econaveAudioService.applySettings(progress.value.settings)

    if (progress.value.settings.muted || progress.value.settings.musicMuted) {
      econaveAudioService.stopMusic()
      return
    }

    if (runtimeState.value?.status === 'running') {
      econaveAudioService.startMusic(runtimeState.value.stageConfig.soundtrack)
    }
  }

  onBeforeUnmount(() => {
    stopLoop()
    econaveAudioService.stopMusic()
    econaveAudioService.destroy()
  })

  return {
    progress,
    runtimeState,
    hud,
    currentResult,
    latestFeedback,
    selectedStageId,
    selectedStage,
    selectedShip,
    stageProgress,
    unlockedStageCount,
    isRunning,
    isPaused,
    syncProgress,
    startStage,
    pauseStage,
    resumeStage,
    restartStage,
    leaveStage,
    setMovement,
    stopMovement,
    setFirePressed,
    triggerPulse,
    selectShip,
    selectStageCard,
    updateSettings
  }
}
