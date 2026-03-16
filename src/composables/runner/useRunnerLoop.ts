import { onBeforeUnmount, ref } from 'vue'
import {
    buildRunnerDifficultySnapshot,
    estimateTargetDistance
} from '@/engine/runner/runtime/difficulty'
import {
    createRunnerSpawnRuntime,
    resetRunnerSpawnRuntime,
    updateRunnerSpawnRuntime
} from '@/engine/runner/runtime/spawn-manager'
import { resolveRunnerCollision } from '@/engine/runner/runtime/collision'
import {
    applyRoundConfigToState,
    buildRoundSummaryText,
    finalizeRoundState,
    syncRunnerPersistentProgress
} from '@/engine/runner/utils/round-state'
import {
    activateShield as activateRunnerShield,
    addRunnerScore,
    canActivateShield,
    restoreOneLife,
    spendRunnerCoins
} from '@/engine/runner/utils/state-mutations'
import { canUseEmergencyHeal, getVehicleById } from '@/engine/runner/utils/progression'
import { getRunnerRoundConfig, RUNNER_ROUNDS } from '@/engine/runner/data/rounds'
import { playerProfileService } from '@/services/playerProfile.service'
import { runnerProgressService } from '@/services/runnerProgress.service'
import type {
    RunnerFeedbackEvent,
    RunnerPersistentProgress,
    RunnerRoundEndReason,
    RunnerRoundSummary
} from '@/types/runner-game'
import type { RunnerEntity, RunnerGameState } from '@/types/runner-state'

interface RunnerLoopCallbacks {
    onFrame?: (deltaMs: number) => void
    onFeedback?: (event: RunnerFeedbackEvent) => void
    onRoundEnd?: (summary: RunnerRoundSummary) => void
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}

function setFeedback(
    gameState: RunnerGameState,
    callbacks: RunnerLoopCallbacks,
    event: RunnerFeedbackEvent
) {
    gameState.ui.lastFeedback = event
    callbacks.onFeedback?.(event)
}

function getProgressRatio(gameState: RunnerGameState): number {
    const durationMs = gameState.roundProgress.currentRoundConfig.durationSeconds * 1000

    if (durationMs <= 0) {
        return 0
    }

    return clamp(gameState.telemetry.elapsedMs / durationMs, 0, 1)
}

function getCollisionZone(entity: RunnerEntity): boolean {
    return entity.depth >= 0.94 && entity.depth <= 1.05
}

export function useRunnerLoop(
    gameState: RunnerGameState,
    callbacks: RunnerLoopCallbacks = {}
) {
    const frameId = ref<number | null>(null)
    const lastTime = ref<number>(0)
    const spawnRuntime = createRunnerSpawnRuntime()

    syncRunnerPersistentProgress(gameState, runnerProgressService.get())
    applyRoundConfigToState(gameState, gameState.roundProgress.currentRound)

    function getPersistentProgress(): RunnerPersistentProgress {
        const progress = runnerProgressService.get()
        syncRunnerPersistentProgress(gameState, progress)
        return progress
    }

    function updateDifficultyAndProgress(deltaMs: number) {
        gameState.telemetry.elapsedMs += deltaMs
        gameState.stats.elapsedSeconds = Number((gameState.telemetry.elapsedMs / 1000).toFixed(1))
        gameState.stats.timeLeft = Math.max(
            0,
            Number(
                (
                    gameState.roundProgress.currentRoundConfig.durationSeconds -
                    gameState.telemetry.elapsedMs / 1000
                ).toFixed(2)
            )
        )

        const progressRatio = getProgressRatio(gameState)
        const difficultySnapshot = buildRunnerDifficultySnapshot(
            gameState.roundProgress.currentRoundConfig,
            progressRatio,
            gameState.player.shieldActive
        )

        gameState.stats.phaseLevel = difficultySnapshot.phaseLevel
        gameState.stats.speed = difficultySnapshot.speed

        const distanceGain = (deltaMs / 1000) * (13.5 + difficultySnapshot.speed * 7.5)
        gameState.stats.distance = Math.min(
            gameState.stats.targetDistance,
            Number((gameState.stats.distance + distanceGain).toFixed(2))
        )

        addRunnerScore(gameState, Math.round((deltaMs / 1000) * (3 + difficultySnapshot.speed * 1.8)))

        return difficultySnapshot
    }

    function updateShield(deltaMs: number) {
        if (!gameState.player.shieldActive) {
            return
        }

        gameState.player.shieldTimeLeft = Math.max(
            0,
            Number((gameState.player.shieldTimeLeft - deltaMs / 1000).toFixed(2))
        )

        if (gameState.player.shieldTimeLeft <= 0) {
            gameState.player.shieldActive = false
            gameState.player.shieldTimeLeft = 0
        }
    }

    function updateEntities(deltaMs: number, entityMovement: number) {
        const movement = (deltaMs / 16.67) * entityMovement

        gameState.entities.forEach((entity) => {
            entity.depth += movement
        })

        gameState.entities = gameState.entities.filter((entity) => entity.depth < 1.24 && entity.active)
    }

    function updateRoadMarkers(deltaMs: number, roadMovement: number) {
        const movement = (deltaMs / 16.67) * roadMovement

        gameState.roadMarkers.forEach((marker) => {
            marker.depth += movement

            if (marker.depth > 1.02) {
                marker.depth = 0.02
            }
        })
    }

    function handleRoundEnd(endReason: RunnerRoundEndReason) {
        const playerName = playerProfileService.get()?.name ?? 'Jogador'
        const { result, finalCard, rankingEntry, summary } = finalizeRoundState(
            gameState,
            playerName,
            endReason
        )
        const progressResult = runnerProgressService.applyRoundRewards({
            coinsEarned: result.coinsEarned,
            carbonCreditsEarned: result.carbonCreditsEarned,
            roundNumber: gameState.roundProgress.currentRound,
            victoryAchieved: result.victoryAchieved,
            rankingEntry
        })

        summary.newlyUnlockedVehicleIds = progressResult.newlyUnlockedVehicleIds
        summary.nextRoundUnlocked = progressResult.nextRoundUnlocked
        summary.canAdvanceToNextRound =
            result.victoryAchieved &&
            gameState.roundProgress.currentRound < progressResult.progress.highestUnlockedRound

        syncRunnerPersistentProgress(gameState, progressResult.progress)

        gameState.stats.score = result.scoreFinal
        gameState.roundProgress.roundCompleted = true
        gameState.roundProgress.completionStatus = result.completionStatus
        gameState.roundProgress.endReason = endReason
        gameState.roundProgress.finalCard = finalCard
        gameState.roundProgress.finalRankingEntry = rankingEntry
        gameState.roundProgress.finalResult = summary
        gameState.roundProgress.finalSummaryText = buildRoundSummaryText(summary)

        callbacks.onRoundEnd?.(summary)
    }

    function processCollisions() {
        gameState.entities.forEach((entity) => {
            const sameLane = entity.lane === gameState.player.lane

            if (!sameLane || !getCollisionZone(entity) || !entity.active) {
                return
            }

            entity.active = false
            const result = resolveRunnerCollision(gameState, entity)

            if (entity.type === 'collectible' && gameState.telemetry.firstCollectAtMs === null) {
                gameState.telemetry.firstCollectAtMs = gameState.telemetry.elapsedMs
            }

            if (entity.type === 'obstacle' && result.lifeLost && gameState.telemetry.firstCollisionAtMs === null) {
                gameState.telemetry.firstCollisionAtMs = gameState.telemetry.elapsedMs
            }

            if (result.feedback) {
                setFeedback(gameState, callbacks, result.feedback)
            }

            if (gameState.stats.lives <= 0) {
                gameState.stats.lives = 0
                gameState.status = 'gameover'
                stop()
                handleRoundEnd('lives_depleted')
            }
        })
    }

    function evaluateRoundCompletion() {
        if (gameState.status !== 'running') {
            return
        }

        const reachedDistance = gameState.stats.distance >= gameState.stats.targetDistance
        const timeExpired = gameState.stats.timeLeft <= 0

        if (!reachedDistance && !timeExpired) {
            return
        }

        gameState.stats.distance = gameState.stats.targetDistance
        const qualifiedEnough = gameState.stats.qualifiedCollects >= gameState.stats.minCollectibles
        const victory = qualifiedEnough && gameState.stats.lives > 0
        const endReason: RunnerRoundEndReason = victory ? 'victory' : 'missed_target'

        gameState.status = victory ? 'victory' : 'gameover'
        stop()
        handleRoundEnd(endReason)
    }

    function tick(now: number) {
        if (gameState.status !== 'running') {
            return
        }

        const deltaMs = lastTime.value ? now - lastTime.value : 16
        lastTime.value = now

        const difficultySnapshot = updateDifficultyAndProgress(deltaMs)
        updateRoadMarkers(deltaMs, difficultySnapshot.roadMovement)
        updateShield(deltaMs)
        updateRunnerSpawnRuntime(gameState, spawnRuntime, difficultySnapshot, deltaMs)
        updateEntities(deltaMs, difficultySnapshot.entityMovement)
        processCollisions()
        evaluateRoundCompletion()

        callbacks.onFrame?.(deltaMs)

        if (gameState.status === 'running') {
            frameId.value = requestAnimationFrame(tick)
        }
    }

    function start() {
        if (gameState.status === 'running') {
            return
        }

        gameState.status = 'running'
        lastTime.value = 0
        frameId.value = requestAnimationFrame(tick)
    }

    function pause() {
        if (gameState.status !== 'running') {
            return
        }

        gameState.status = 'paused'
        stop()
    }

    function resume() {
        if (gameState.status !== 'paused') {
            return
        }

        start()
    }

    function stop() {
        if (frameId.value !== null) {
            cancelAnimationFrame(frameId.value)
            frameId.value = null
        }
    }

    function activateShield() {
        const activated = activateRunnerShield(gameState)

        if (activated) {
            setFeedback(gameState, callbacks, {
                kind: 'shield',
                tone: 'neutral',
                text: 'Escudo ativado: agora voce pode segurar uma colisao ou coletar itens arriscados.',
                icon: '🛡️'
            })
        }

        return activated
    }

    function useEmergencyHeal() {
        const roundConfig = gameState.roundProgress.currentRoundConfig
        const result = canUseEmergencyHeal({
            currentLives: gameState.stats.lives,
            currentCoins: gameState.stats.coins,
            healCost: roundConfig.emergencyHealCost,
            timeRemainingSeconds: gameState.stats.timeLeft,
            roundDurationSeconds: roundConfig.durationSeconds,
            alreadyUsedEmergencyHeal: gameState.player.emergencyHealUsed
        })

        if (!result.allowed) {
            return false
        }

        spendRunnerCoins(gameState, roundConfig.emergencyHealCost)
        restoreOneLife(gameState)
        gameState.player.emergencyHealUsed = true
        setFeedback(gameState, callbacks, {
            kind: 'heal',
            tone: 'positive',
            text: 'Cura emergencial usada. Ultima chance de fechar a rodada.',
            icon: '❤️'
        })
        return true
    }

    function reset(roundNumber = gameState.roundProgress.currentRound) {
        stop()
        resetRunnerSpawnRuntime(spawnRuntime)
        gameState.status = 'idle'
        applyRoundConfigToState(gameState, roundNumber)
        getPersistentProgress()
    }

    function selectRound(roundNumber: number) {
        if (gameState.status === 'running') {
            return false
        }

        if (roundNumber < 1 || roundNumber > gameState.meta.highestUnlockedRound) {
            return false
        }

        reset(roundNumber)
        return true
    }

    function selectVehicle(vehicleId: string) {
        if (!gameState.meta.unlockedVehicleIds.includes(vehicleId)) {
            return false
        }

        const progress = runnerProgressService.selectVehicle(vehicleId)
        syncRunnerPersistentProgress(gameState, progress)
        const vehicle = getVehicleById(vehicleId)

        if (gameState.status !== 'running' && vehicle) {
            setFeedback(gameState, callbacks, {
                kind: 'round',
                tone: 'neutral',
                text: `Veiculo selecionado: ${vehicle.name}.`,
                icon: vehicle.emoji
            })
        }

        return true
    }

    function advanceToNextRound() {
        const nextRound = Math.min(
            RUNNER_ROUNDS.length,
            gameState.roundProgress.currentRound + 1
        )

        if (nextRound > gameState.meta.highestUnlockedRound) {
            return false
        }

        reset(nextRound)
        return true
    }

    function reloadPersistentProgress() {
        syncRunnerPersistentProgress(gameState, runnerProgressService.get())
        const desiredRound = clamp(
            gameState.roundProgress.currentRound,
            1,
            gameState.meta.highestUnlockedRound
        )

        if (gameState.status !== 'running') {
            applyRoundConfigToState(gameState, desiredRound)
        }
    }

    function getRoundTitle(roundNumber = gameState.roundProgress.currentRound) {
        return getRunnerRoundConfig(roundNumber).title
    }

    onBeforeUnmount(() => {
        stop()
    })

    return {
        start,
        pause,
        resume,
        reset,
        stop,
        activateShield,
        canActivateShield: () => canActivateShield(gameState),
        useEmergencyHeal,
        selectRound,
        selectVehicle,
        advanceToNextRound,
        reloadPersistentProgress,
        getPersistentProgress,
        getRoundTitle,
        getEstimatedTargetDistance: estimateTargetDistance
    }
}
