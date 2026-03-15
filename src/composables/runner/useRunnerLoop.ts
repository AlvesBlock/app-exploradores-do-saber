import { onBeforeUnmount, ref } from 'vue'
import { createCollectibleEntity, createObstacleEntity } from '@/engine/runner/entities'
import type { RunnerEntity, RunnerGameState } from '@/types/runner'

interface RunnerLoopCallbacks {
    onFrame?: (deltaMs: number) => void
    onCollect?: () => void
    onHit?: () => void
}

export function useRunnerLoop(
    gameState: RunnerGameState,
    callbacks: RunnerLoopCallbacks = {}
) {
    const frameId = ref<number | null>(null)
    const lastTime = ref<number>(0)
    const spawnTimer = ref<number>(0)

    function spawnEntity() {
        const shouldSpawnCollectible = Math.random() > 0.45
        const entity = shouldSpawnCollectible
            ? createCollectibleEntity()
            : createObstacleEntity()

        gameState.entities.push(entity)
    }

    function updateDifficulty() {
        const progressRatio = gameState.stats.distance / gameState.stats.targetDistance

        if (progressRatio >= 0.66) {
            gameState.stats.phaseLevel = 3
            gameState.stats.speed = 1.15
        } else if (progressRatio >= 0.33) {
            gameState.stats.phaseLevel = 2
            gameState.stats.speed = 1
        } else {
            gameState.stats.phaseLevel = 1
            gameState.stats.speed = 0.85
        }

        if (gameState.player.turboActive) {
            gameState.stats.speed += 0.65
        }
    }

    function updateTurbo(deltaMs: number) {
        if (!gameState.player.turboActive) return

        gameState.player.turboTimeLeft = Math.max(
            0,
            Number(((gameState.player.turboTimeLeft ?? 0) - deltaMs / 1000).toFixed(2))
        )

        if ((gameState.player.turboTimeLeft ?? 0) <= 0) {
            gameState.player.turboActive = false
            gameState.player.turboTimeLeft = 0
        }
    }

    function updateEntities(deltaMs: number) {
        const movement = (deltaMs / 16.67) * gameState.stats.speed * 0.015

        gameState.entities.forEach((entity) => {
            entity.depth += movement
        })

        gameState.entities = gameState.entities.filter(
            (entity) => entity.depth < 1.28 && entity.active
        )
    }

    function updateRoadMarkers(deltaMs: number) {
        const markerSpeedBase = 0.012
        const turboBoost = gameState.player.turboActive ? 0.01 : 0
        const movement = (deltaMs / 16.67) * (markerSpeedBase + gameState.stats.speed * 0.01 + turboBoost)

        gameState.roadMarkers!.forEach((marker) => {
            marker.depth += movement

            if (marker.depth > 1.02) {
                marker.depth = 0.02
            }
        })
    }

    function processCollisions() {
        gameState.entities.forEach((entity: RunnerEntity) => {
            const sameLane = entity.lane === gameState.player.lane
            const collisionZone = entity.depth >= 0.93 && entity.depth <= 1.08

            if (!sameLane || !collisionZone || !entity.active) return

            entity.active = false

            if (entity.type === 'collectible') {
                gameState.stats.coins += 1
                gameState.stats.collectedCount += 1
                gameState.stats.score += 25
                gameState.player.turboCharge = Math.min(
                    10,
                    (gameState.player.turboCharge ?? 0) + 1
                )
                callbacks.onCollect?.()
                return
            }

            if (entity.type === 'obstacle') {
                gameState.stats.lives -= 1
                gameState.stats.score = Math.max(0, gameState.stats.score - 20)
                callbacks.onHit?.()

                if (gameState.stats.lives <= 0) {
                    gameState.stats.lives = 0
                    gameState.status = 'gameover'
                    stop()
                }
            }
        })
    }

    function tick(now: number) {
        if (gameState.status !== 'running') return

        const deltaMs = lastTime.value ? now - lastTime.value : 16
        lastTime.value = now

        updateDifficulty()
        updateRoadMarkers(deltaMs)
        updateTurbo(deltaMs)

        const speedFactor = gameState.stats.speed
        const distanceGain = (deltaMs / 16.67) * speedFactor * 0.9
        const scoreGain = Math.floor((deltaMs / 16.67) * speedFactor * 0.7)
        const timeLoss = deltaMs / 1000

        gameState.stats.distance += Number(distanceGain.toFixed(2))
        gameState.stats.score += scoreGain
        gameState.stats.timeLeft = Math.max(
            0,
            Number((gameState.stats.timeLeft - timeLoss).toFixed(2))
        )

        if (gameState.stats.timeLeft <= 0) {
            gameState.status = 'gameover'
            stop()
            return
        }

        spawnTimer.value += deltaMs
        if (spawnTimer.value >= 650) {
            spawnEntity()
            spawnTimer.value = 0
        }

        updateEntities(deltaMs)
        processCollisions()

        if (gameState.stats.distance >= gameState.stats.targetDistance) {
            gameState.stats.distance = gameState.stats.targetDistance

            if (gameState.stats.collectedCount >= gameState.stats.minCollectibles) {
                gameState.status = 'victory'
            } else {
                gameState.status = 'gameover'
            }

            stop()
            return
        }

        callbacks.onFrame?.(deltaMs)

        frameId.value = requestAnimationFrame(tick)
    }

    function start() {
        if (gameState.status === 'running') return

        gameState.status = 'running'
        lastTime.value = 0
        frameId.value = requestAnimationFrame(tick)
    }

    function pause() {
        if (gameState.status !== 'running') return
        gameState.status = 'paused'
        stop()
    }

    function resume() {
        if (gameState.status !== 'paused') return
        start()
    }

    function stop() {
        if (frameId.value !== null) {
            cancelAnimationFrame(frameId.value)
            frameId.value = null
        }
    }

    function activateTurbo() {
        if ((gameState.player.turboCharge ?? 0) < 10) return false
        if (gameState.player.turboActive) return false

        gameState.player.turboCharge = 0
        gameState.player.turboActive = true
        gameState.player.turboTimeLeft = 4
        return true
    }

    function upgradeVehicle(nextCost: number) {
        if (gameState.stats.coins < nextCost) return false
        gameState.stats.coins -= nextCost
        gameState.player.vehicleLevel += 1
        return true
    }

    function reset() {
        stop()
        spawnTimer.value = 0
        gameState.status = 'idle'
        gameState.player.lane = 1
        gameState.player.isJumping = false
        gameState.player.jumpProgress = 0
        gameState.player.vehicleLevel = 0
        gameState.player.isInvulnerable = false
        gameState.player.turboActive = false
        gameState.player.turboCharge = 0
        gameState.player.turboTimeLeft = 0

        gameState.stats.score = 0
        gameState.stats.coins = 0
        gameState.stats.lives = 3
        gameState.stats.distance = 0
        gameState.stats.targetDistance = 3000
        gameState.stats.speed = 0.85
        gameState.stats.timeLeft = 75
        gameState.stats.minCollectibles = 10
        gameState.stats.collectedCount = 0
        gameState.stats.phaseLevel = 1

        gameState.entities = []

        gameState.roadMarkers = Array.from({ length: 9 }, (_, index) => ({
            id: `marker-${index + 1}`,
            depth: index / 9
        }))
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
        activateTurbo,
        upgradeVehicle
    }
}