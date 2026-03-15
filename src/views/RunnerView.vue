<template>
    <div class="kids-page runner-page">
        <div class="kids-container">
            <div class="kids-card p-4 md:p-6 mb-4">
                <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-4">
                    <div>
                        <div class="runner-chip mb-2">Modo Arcade</div>
                        <h1 class="kids-title mb-2">Runner da Reciclagem</h1>
                        <p class="kids-subtitle mb-0">
                            Corra pela cidade educativa, colete recicláveis e desvie dos obstáculos.
                        </p>
                    </div>

                    <div class="flex flex-column md:flex-row gap-2">
                        <Button label="Voltar ao hub" icon="pi pi-arrow-left" severity="secondary" outlined
                            @click="goHub" />

                        <Button label="Resetar" icon="pi pi-refresh" severity="secondary" outlined
                            @click="resetRunner" />
                    </div>
                </div>
            </div>

            <div class="kids-card p-4 md:p-6">
                <div class="runner-overlay-status mb-3">
                    <span class="status-pill" :class="gameState.status">
                        {{ statusLabel }}
                    </span>
                </div>

                <div class="runner-stage" :style="{ backgroundImage: `url(${runnerCityBg})` }">
                    <div class="runner-stage-overlay"></div>
                    <div class="runner-stage-ground-glow"></div>
                    <!-- <div class="runner-sky">☁️ ☀️ 🌈</div>

                    <div class="runner-horizon">
                        🏫 🌳 🔬
                    </div> -->

                    <div v-if="collectFlash" class="runner-flash collect"></div>
                    <div v-if="hitFlash" class="runner-flash hit"></div>

                    <div v-if="feedbackText" class="runner-feedback-text" :class="feedbackType">
                        {{ feedbackText }}
                    </div>

                    <div class="runner-road">
                        <div class="road-edge-glow right"></div>

                        <div class="lane lane-left"></div>
                        <div class="lane lane-center"></div>
                        <div class="lane lane-right"></div>

                        <div v-for="marker in gameState.roadMarkers" :key="marker.id" class="road-marker"
                            :style="getRoadMarkerStyle(marker.depth)"></div>

                        <div v-for="entity in gameState.entities" :key="entity.id" class="runner-entity"
                            :class="entity.type" :style="getEntityStyle(entity.lane, entity.depth)">
                            {{ entity.emoji }}
                        </div>

                        <div class="runner-player" :class="{ turbo: gameState.player.turboActive }"
                            :style="playerStyle">
                            {{ currentVehicle }}
                        </div>

                    </div>
                </div>

                <div class="grid mt-4">
                    <div class="col-12 md:col-6 xl:col-2">
                        <div class="runner-stat">
                            <div class="runner-stat-label">Score</div>
                            <div class="runner-stat-value">{{ gameState.stats.score }}</div>
                        </div>
                    </div>

                    <div class="col-12 md:col-6 xl:col-2">
                        <div class="runner-stat">
                            <div class="runner-stat-label">Moedas</div>
                            <div class="runner-stat-value">🪙 {{ gameState.stats.coins }}</div>
                        </div>
                    </div>

                    <div class="col-12 md:col-6 xl:col-2">
                        <div class="runner-stat">
                            <div class="runner-stat-label">Vidas</div>
                            <div class="runner-stat-value">❤️ {{ gameState.stats.lives }}</div>
                        </div>
                    </div>

                    <div class="col-12 md:col-6 xl:col-2">
                        <div class="runner-stat">
                            <div class="runner-stat-label">Distância</div>
                            <div class="runner-stat-value">{{ Math.floor(gameState.stats.distance) }}</div>
                        </div>
                    </div>

                    <div class="col-12 md:col-6 xl:col-2">
                        <div class="runner-stat">
                            <div class="runner-stat-label">Meta</div>
                            <div class="runner-stat-value">{{ gameState.stats.targetDistance }}</div>
                        </div>
                    </div>

                    <div class="col-12 md:col-6 xl:col-2">
                        <div class="runner-stat">
                            <div class="runner-stat-label">Velocidade</div>
                            <div class="runner-stat-value">⚡ {{ gameState.stats.speed }}</div>
                        </div>
                    </div>

                    <div class="col-12 md:col-6 xl:col-2">
                        <div class="runner-stat">
                            <div class="runner-stat-label">Tempo</div>
                            <div class="runner-stat-value">⏳ {{ Math.ceil(gameState.stats.timeLeft) }}</div>
                        </div>
                    </div>

                    <div class="col-12 md:col-6 xl:col-2">
                        <div class="runner-stat">
                            <div class="runner-stat-label">Recicláveis</div>
                            <div class="runner-stat-value">♻️ {{ gameState.stats.collectedCount }}/{{
                                gameState.stats.minCollectibles }}</div>
                        </div>
                    </div>

                    <div class="col-12 md:col-6 xl:col-2">
                        <div class="runner-stat">
                            <div class="runner-stat-label">Fase de ritmo</div>
                            <div class="runner-stat-value">🚦 {{ gameState.stats.phaseLevel }}</div>
                        </div>
                    </div>

                    <div class="col-12 md:col-6 xl:col-2">
                        <div class="runner-stat">
                            <div class="runner-stat-label">Turbo</div>
                            <div class="runner-stat-value">
                                🚀 {{ gameState.player.turboCharge }}/10
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-6 xl:col-2">
                        <div class="runner-stat">
                            <div class="runner-stat-label">Veículo</div>
                            <div class="runner-stat-value">
                                {{ currentVehicle }} Nv. {{ gameState.player.vehicleLevel + 1 }}
                            </div>
                        </div>
                    </div>


                </div>

                <div class="mt-4">
                    <div class="runner-progress-label">
                        Progresso da corrida: {{ Math.floor(gameState.stats.distance) }}/{{
                            gameState.stats.targetDistance }}
                    </div>
                    <ProgressBar :value="progressPercent" style="height: 18px" />
                </div>

                <div class="flex flex-column md:flex-row gap-3 justify-content-center mt-4">
                    <Button label="Esquerda" icon="pi pi-arrow-left" severity="secondary" outlined @click="moveLeft" />

                    <Button v-if="gameState.status === 'idle'" label="Iniciar" icon="pi pi-play" @click="startRunner" />

                    <Button v-else-if="gameState.status === 'running'" label="Pausar" icon="pi pi-pause" severity="warn"
                        @click="pauseRunner" />

                    <Button v-else-if="gameState.status === 'paused'" label="Continuar" icon="pi pi-play"
                        severity="success" @click="resumeRunner" />

                    <Button v-else-if="gameState.status === 'victory'" label="Jogar novamente" icon="pi pi-refresh"
                        severity="success" @click="resetRunner" />

                    <Button v-else-if="gameState.status === 'gameover'" label="Tentar novamente" icon="pi pi-refresh"
                        severity="danger" @click="resetRunner" />

                    <Button label="Direita" icon="pi pi-arrow-right" severity="secondary" outlined @click="moveRight" />
                </div>

                <div class="text-center mt-4 runner-helper">
                    Teclas: Enter inicia, P pausa, A/← esquerda, D/→ direita.
                    Para vencer: chegue ao fim com tempo e colete pelo menos {{ gameState.stats.minCollectibles }}
                    recicláveis.
                </div>

                <div class="flex flex-column md:flex-row gap-3 justify-content-center mt-3">
                    <Button label="Ativar turbo" icon="pi pi-bolt" severity="warn" :disabled="!canTurbo"
                        @click="useTurbo" />

                    <Button
                        :label="nextUpgradeCost !== null ? `Tunar veículo (${nextUpgradeCost} moedas)` : 'Veículo no máximo'"
                        icon="pi pi-cog" severity="success" outlined :disabled="nextUpgradeCost === null || !canUpgrade"
                        @click="tuneVehicle" />
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import { runnerAudioService } from '@/services/runnerAudio.service'
import runnerCityBg from '@/assets/images/runner-city-bg.png'

import { useRunnerInput } from '@/composables/runner/useRunnerInput'
import { useRunnerLoop } from '@/composables/runner/useRunnerLoop'
import { RUNNER_DEFAULT_STATE, VEHICLE_STAGES, VEHICLE_UPGRADE_COSTS } from '@/engine/runner/constants'
import type { LaneIndex } from '@/types/runner'

const router = useRouter()

const gameState = reactive(structuredClone(RUNNER_DEFAULT_STATE))

const collectFlash = ref(false)
const hitFlash = ref(false)
const feedbackText = ref('')
const feedbackType = ref<'collect' | 'hit'>('collect')

const playerLaneClass = computed(() => {
    return getLaneClass(gameState.player.lane)
})

const playerStyle = computed(() => {
    const {
        canvasWidth,
        bottomY,
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

    return {
        left: `${leftPercent}%`
    }
})

const statusLabel = computed(() => {
    const map = {
        idle: 'Pronto para correr',
        running: 'Correndo',
        paused: 'Pausado',
        victory: 'Vitória!',
        gameover: 'Game Over'
    }

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

const canUpgrade = computed(() => {
    return nextUpgradeCost.value !== null && gameState.stats.coins >= (nextUpgradeCost.value ?? 0)
})

const canTurbo = computed(() => {
    return (gameState.player.turboCharge ?? 0) >= 10 && !gameState.player.turboActive
})

function getLaneClass(lane: LaneIndex) {
    if (lane === 0) return 'lane-pos-left'
    if (lane === 2) return 'lane-pos-right'
    return 'lane-pos-center'
}

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

    // Interpola a linha horizontal onde a entidade está
    const yPx = horizonY + (bottomY - horizonY) * d

    // Interpola as bordas esquerda e direita da pista nessa profundidade
    const leftX = topLeftX + (bottomLeftX - topLeftX) * d
    const rightX = topRightX + (bottomRightX - topRightX) * d

    const roadWidth = rightX - leftX
    const laneWidth = roadWidth / laneCount

    // Centro visual da lane
    const xPx = leftX + laneWidth * (lane + 0.5)

    // Converter para o container atual em %
    const leftPercent = (xPx / canvasWidth) * 100
    const topPercent = (yPx / canvasHeight) * 100

    // Escala cresce conforme aproxima da base
    const scale = 0.38 + d * 1.45

    // Leve aumento de opacidade ao se aproximar
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
    } = {
        ...ROAD_PROJECTION,
        roadCenterX: 767.17,
        roadHalfWidthFar: 18.35,
        roadHalfWidthNear: 396.93
    }

    const yPx = horizonY + (bottomY - horizonY) * d

    const halfRoadWidth =
        roadHalfWidthFar + (roadHalfWidthNear - roadHalfWidthFar) * d

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

    window.setTimeout(() => {
        collectFlash.value = false
    }, 180)

    window.setTimeout(() => {
        if (feedbackType.value === 'collect') {
            feedbackText.value = ''
        }
    }, 700)
}

function triggerHitFeedback() {
    runnerAudioService.playHit()
    hitFlash.value = true
    feedbackText.value = '-1 vida'
    feedbackType.value = 'hit'

    window.setTimeout(() => {
        hitFlash.value = false
    }, 220)

    window.setTimeout(() => {
        if (feedbackType.value === 'hit') {
            feedbackText.value = ''
        }
    }, 700)
}

function goHub() {
    router.push('/hub')
}

const { start, pause, resume, reset, activateTurbo, upgradeVehicle } = useRunnerLoop(gameState, {
    onCollect: triggerCollectFeedback,
    onHit: triggerHitFeedback
})

function onPauseToggle() {
    if (gameState.status === 'running') {
        pause()
        return
    }

    if (gameState.status === 'paused') {
        resume()
    }
}

const { moveLeft, moveRight } = useRunnerInput(gameState, {
    onStart: () => {
        if (gameState.status === 'idle') {
            start()
        } else if (gameState.status === 'paused') {
            resume()
        }
    },
    onPauseToggle
})

function startRunner() {
    if (gameState.status === 'idle') start()
}

function pauseRunner() {
    pause()
}

function resumeRunner() {
    resume()
}

function resetRunner() {
    reset()
}

function useTurbo() {
    activateTurbo()
}

function tuneVehicle() {
    if (nextUpgradeCost.value === null) return
    upgradeVehicle(nextUpgradeCost.value)
}

</script>

<style scoped>
.runner-page {
    background: linear-gradient(180deg, #eef7ff 0%, #fff8ea 100%);
}

.runner-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #eaf3ff;
    color: #315ea8;
    border-radius: 999px;
    padding: 8px 14px;
    font-size: 0.9rem;
    font-weight: 700;
}

.runner-overlay-status {
    display: flex;
    justify-content: center;
}

.status-pill {
    border-radius: 999px;
    padding: 8px 14px;
    font-weight: 800;
    font-size: 0.9rem;
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

.runner-stage {
    border-radius: 28px;
    overflow: hidden;
    min-height: 420px;
    position: relative;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    box-shadow:
        inset 0 0 0 1px rgba(0, 0, 0, 0.04),
        0 18px 40px rgba(0, 0, 0, 0.08);
}

.runner-stage-overlay {
    position: absolute;
    inset: 0;
    background:
        linear-gradient(180deg, rgba(210, 235, 255, 0.35) 0%, rgba(255, 255, 255, 0.06) 35%, rgba(250, 244, 232, 0.22) 100%);
    backdrop-filter: saturate(1.03);
    z-index: 0;
    pointer-events: none;
}

.runner-stage-ground-glow {
    position: absolute;
    left: 50%;
    bottom: 22px;
    width: 72%;
    height: 90px;
    transform: translateX(-50%);
    background: radial-gradient(circle, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.06) 35%, rgba(0, 0, 0, 0) 75%);
    filter: blur(18px);
    z-index: 0;
    pointer-events: none;
}

.runner-sky {
    position: relative;
    z-index: 1;
    text-align: center;
    padding-top: 20px;
    font-size: 1.6rem;
    letter-spacing: 8px;
    opacity: 0.92;
}

.runner-horizon {
    position: relative;
    z-index: 1;
    text-align: center;
    margin-top: 28px;
    font-size: 1.4rem;
    opacity: 0.9;
}


.runner-flash {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
}

.runner-flash.collect {
    background: radial-gradient(circle, rgba(67, 214, 126, 0.22) 0%, rgba(67, 214, 126, 0.08) 45%, rgba(67, 214, 126, 0) 75%);
}

.runner-flash.hit {
    background: radial-gradient(circle, rgba(255, 97, 97, 0.28) 0%, rgba(255, 97, 97, 0.1) 45%, rgba(255, 97, 97, 0) 75%);
}

.runner-feedback-text {
    position: absolute;
    top: 18px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;
    padding: 10px 16px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 1rem;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
}

.runner-feedback-text.collect {
    background: #ebfff2;
    color: #177245;
}

.runner-feedback-text.hit {
    background: #fff0f0;
    color: #9c2d2d;
}

.runner-stage-overlay {
    position: absolute;
    inset: 0;
    background:
        linear-gradient(180deg, rgba(210, 235, 255, 0.35) 0%, rgba(255, 255, 255, 0.06) 35%, rgba(250, 244, 232, 0.22) 100%);
    backdrop-filter: saturate(1.03);
    z-index: 0;
    pointer-events: none;
}

.runner-stage-ground-glow {
    position: absolute;
    left: 50%;
    bottom: 22px;
    width: 72%;
    height: 90px;
    transform: translateX(-50%);
    background: radial-gradient(circle, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.06) 35%, rgba(0, 0, 0, 0) 75%);
    filter: blur(18px);
    z-index: 0;
    pointer-events: none;
}


.runner-player.turbo {
    filter: drop-shadow(0 0 16px rgba(255, 196, 0, 0.9)) drop-shadow(0 8px 10px rgba(0, 0, 0, 0.22));
}

.lane {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.42) 55%, rgba(255, 255, 255, 0.18) 100%);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.08);
}


.lane-left {
    left: 33.33%;
}

.lane-center {
    left: 50%;
}

.lane-right {
    left: 66.66%;
}

.runner-entity {
    position: absolute;
    font-size: 2rem;
    line-height: 1;
    pointer-events: none;
    will-change: transform, top, left;
    transition: none;
    filter:
        drop-shadow(0 6px 8px rgba(0, 0, 0, 0.18)) drop-shadow(0 0 6px rgba(255, 255, 255, 0.06));
    z-index: 2;
}


.runner-entity.collectible {
    z-index: 2;
}

.runner-entity.obstacle {
    z-index: 2;
}

.runner-player {
    position: absolute;
    bottom: 17%;
    font-size: 3.15rem;
    transform: translate(-50%, 0);
    transition:
        left 0.18s ease,
        transform 0.12s ease;
    filter:
        drop-shadow(0 10px 12px rgba(0, 0, 0, 0.24)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.08));
    z-index: 3;
}

.runner-stat {
    background: #fff;
    border-radius: 18px;
    padding: 14px;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
    min-height: 92px;
}

.runner-stat-label {
    font-size: 0.85rem;
    color: var(--kids-muted);
    font-weight: 700;
    margin-bottom: 8px;
}

.runner-stat-value {
    font-size: 1.25rem;
    font-weight: 800;
}

.runner-progress-label {
    font-size: 0.92rem;
    font-weight: 700;
    margin-bottom: 8px;
}

.runner-helper {
    color: var(--kids-muted);
    font-weight: 600;
}

/* ANIMACAO DA PISTA */
.road-marker {
    position: absolute;
    border-radius: 999px;
    background: linear-gradient(180deg,
            rgba(255, 255, 255, 0.92) 0%,
            rgba(255, 255, 255, 0.72) 100%);
    box-shadow:
        0 0 10px rgba(255, 255, 255, 0.14),
        0 2px 6px rgba(0, 0, 0, 0.08);
    z-index: 1;
    pointer-events: none;
}

.road-edge-glow {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 12px;
    pointer-events: none;
    z-index: 1;
    filter: blur(3px);
    opacity: 0.45;
}

.road-edge-glow.left {
    left: 0;
    background: linear-gradient(180deg,
            rgba(255, 255, 255, 0.04) 0%,
            rgba(255, 255, 255, 0.18) 45%,
            rgba(255, 255, 255, 0.08) 100%);
}

.road-edge-glow.right {
    right: 0;
    background: linear-gradient(180deg,
            rgba(255, 255, 255, 0.04) 0%,
            rgba(255, 255, 255, 0.18) 45%,
            rgba(255, 255, 255, 0.08) 100%);
}
</style>