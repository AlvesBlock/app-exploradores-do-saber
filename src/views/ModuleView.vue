<template>
    <div class="kids-page">
        <div class="kids-container" v-if="moduleData">
            <div class="kids-card p-4 md:p-6 mb-4">
                <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-4">
                    <div>
                        <div class="text-5xl mb-2">{{ moduleData.emoji }}</div>
                        <div class="world-chip mb-2">{{ worldLabel }}</div>
                        <h1 class="kids-title mb-2">{{ moduleData.title }}</h1>
                        <p class="kids-subtitle mb-2">{{ moduleData.description }}</p>

                        <div class="text-sm font-semibold mb-2">
                            Progresso no módulo: {{ reactiveModuleProgress?.completedPhases ?? 0 }}/{{
                                moduleData.totalPhases }}
                        </div>
                        <ProgressBar :value="progressPercent" style="height: 14px" />
                    </div>

                    <div class="phase-badge" v-if="currentPhase">
                        Fase {{ currentPhase.order }} de {{ moduleData.totalPhases }}
                    </div>
                </div>
            </div>

            <div v-if="hasPhases && !moduleCompleted && currentPhase" class="kids-card p-4 md:p-6">
                <div class="text-center mb-4">
                    <div class="text-4xl mb-2">🎯</div>
                    <h2 class="text-2xl font-bold mb-2">{{ currentPhase.question.title }}</h2>
                    <p class="text-lg">{{ currentPhase.question.prompt }}</p>
                </div>

                <div class="grid">
                    <div v-for="option in currentPhase.question.options" :key="String(option.value)"
                        class="col-12 md:col-4">
                        <button type="button" class="answer-card w-full" :class="getAnswerState(option.value)"
                            :disabled="isChecking" @click="selectedAnswer = option.value">
                            {{ option.label }}
                        </button>
                    </div>
                </div>

                <div class="mt-5 flex flex-column md:flex-row gap-3 justify-content-center">
                    <Button label="Voltar ao hub" icon="pi pi-arrow-left" severity="secondary" outlined
                        @click="goHub" />

                    <Button :label="isChecking ? 'Verificando...' : 'Verificar resposta'" icon="pi pi-check"
                        :disabled="selectedAnswer === null || isChecking" @click="checkAnswer" />


                </div>
            </div>

            <div v-else-if="moduleCompleted" class="kids-card p-4 md:p-6 text-center">
                <div class="text-6xl mb-3">🏆</div>
                <h2 class="text-3xl font-bold mb-3">Módulo concluído!</h2>
                <p class="text-lg mb-4">
                    Parabéns! Você terminou a <strong>{{ moduleData.title }}</strong> e ganhou estrelas estudando
                    brincando.
                </p>

                <div class="completion-box mb-4">
                    <div><strong>Fases concluídas:</strong> {{ reactiveModuleProgress?.completedPhases ?? 0 }}/{{
                        moduleData.totalPhases }}</div>
                    <div><strong>Estrelas no módulo:</strong> ⭐ {{ reactiveModuleProgress?.earnedStars ?? 0 }}</div>
                </div>

                <div class="flex flex-column md:flex-row gap-3 justify-content-center">
                    <Button label="Voltar ao hub" icon="pi pi-home" @click="goHub" />

                    <Button label="Jogar novamente depois" icon="pi pi-refresh" severity="secondary" outlined
                        @click="goHub" />
                </div>
            </div>

            <div v-else class="kids-card p-4 md:p-6 text-center">
                <div class="text-6xl mb-3">🛠️</div>
                <h2 class="text-3xl font-bold mb-3">Módulo em construção</h2>
                <p class="text-lg mb-4">
                    Ainda vamos adicionar as fases de <strong>{{ moduleData.title }}</strong>.
                </p>

                <div class="completion-box mb-4">
                    <div><strong>Status:</strong> conteúdo ainda não cadastrado</div>
                    <div><strong>Próximo passo:</strong> criar as 3 fases deste mundo</div>
                </div>

                <div class="flex justify-content-center">
                    <Button label="Voltar ao hub" icon="pi pi-arrow-left" severity="secondary" outlined
                        @click="goHub" />
                </div>
            </div>


        </div>

        <Toast />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import confetti from 'canvas-confetti'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

import { gameModules, modulePhases } from '@/data/modules/modules.data'
import { audioService } from '@/services/audio.service'
import { moduleProgressService } from '@/services/moduleProgress.service'
import { playerProfileService } from '@/services/playerProfile.service'
import type { ModuleId, ModuleProgress } from '@/types/module'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const selectedAnswer = ref<string | number | null>(null)
const revealedCorrectAnswer = ref<string | number | null>(null)
const revealedWrongAnswer = ref<string | number | null>(null)
const isChecking = ref(false)

const moduleId = computed(() => route.params.id as ModuleId)

const moduleData = computed(() => {
    return gameModules.find((item) => item.id === moduleId.value) ?? null
})

const worldLabel = computed(() => {
    const map: Record<ModuleId, string> = {
        math: 'Mundo da Matemática',
        science: 'Mundo da Ciência',
        geography: 'Mundo da Geografia',
        language: 'Mundo das Palavras'
    }

    return map[moduleId.value] ?? 'Mundo da Aventura'
})

const phases = computed(() => {
    return modulePhases
        .filter((item) => item.moduleId === moduleId.value)
        .sort((a, b) => a.order - b.order)
})

const reactiveModuleProgress = ref<ModuleProgress | null>(
    moduleProgressService.getByModule(moduleId.value)
)

const currentPhase = computed(() => {
    return (
        phases.value.find(
            (phase) =>
                !reactiveModuleProgress.value?.completedPhaseIds.includes(phase.id)
        ) ?? null
    )
})

const hasPhases = computed(() => phases.value.length > 0)

const moduleCompleted = computed(() => {
    if (!moduleData.value || !reactiveModuleProgress.value) return false

    return reactiveModuleProgress.value.completedPhases >= moduleData.value.totalPhases
})

const progressPercent = computed(() => {
    if (!moduleData.value || !reactiveModuleProgress.value) return 0

    return Math.round(
        (reactiveModuleProgress.value.completedPhases / moduleData.value.totalPhases) * 100
    )
})

function syncModuleProgress() {
    reactiveModuleProgress.value = moduleProgressService.getByModule(moduleId.value)
}

function resetAnswerFeedback() {
    selectedAnswer.value = null
    revealedCorrectAnswer.value = null
    revealedWrongAnswer.value = null
    isChecking.value = false
}

function goHub() {
    router.push('/hub')
}

function fireConfetti() {
    confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
    })
}

function checkAnswer() {
    if (!currentPhase.value) return
    if (selectedAnswer.value === null) return
    if (isChecking.value) return

    isChecking.value = true

    const question = currentPhase.value.question

    if (selectedAnswer.value === question.correctAnswer) {
        revealedCorrectAnswer.value = question.correctAnswer
        audioService.playSuccess()

        const justCompletedPhaseId = currentPhase.value.id

        const wasNewCompletion = moduleProgressService.completePhase(
            moduleId.value,
            justCompletedPhaseId,
            question.rewardStars
        )

        if (wasNewCompletion) {
            playerProfileService.addStars(question.rewardStars)
            syncModuleProgress()
        }

        toast.add({
            severity: 'success',
            summary: 'Parabéns!',
            detail: question.successMessage,
            life: 2200
        })

        const isNowCompleted =
            reactiveModuleProgress.value?.completedPhases === moduleData.value?.totalPhases

        window.setTimeout(() => {
            if (isNowCompleted) {
                fireConfetti()
            }

            resetAnswerFeedback()
        }, 900)

        return
    }

    revealedWrongAnswer.value = selectedAnswer.value
    revealedCorrectAnswer.value = question.correctAnswer
    audioService.playError()

    toast.add({
        severity: 'warn',
        summary: 'Quase lá!',
        detail: question.errorMessage,
        life: 2200
    })

    window.setTimeout(() => {
        revealedWrongAnswer.value = null
        revealedCorrectAnswer.value = null
        selectedAnswer.value = null
        isChecking.value = false
    }, 1100)
}

function getAnswerState(optionValue: string | number) {
    if (revealedCorrectAnswer.value === optionValue) return 'correct'
    if (revealedWrongAnswer.value === optionValue) return 'wrong'
    if (selectedAnswer.value === optionValue) return 'selected'
    return ''
}
</script>

<style scoped>
.phase-badge {
    background: #eef4ff;
    color: #2f2f3a;
    border-radius: 999px;
    padding: 12px 18px;
    font-weight: 700;
}

.world-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff3d6;
    color: #7b5200;
    border-radius: 999px;
    padding: 8px 14px;
    font-size: 0.9rem;
    font-weight: 700;
}

.answer-card {
    border: 3px solid transparent;
    border-radius: 22px;
    padding: 20px 16px;
    background: white;
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: 700;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        border-color 0.2s ease,
        background-color 0.2s ease;
}

.answer-card:hover:not(:disabled) {
    transform: translateY(-2px);
}

.answer-card:disabled {
    cursor: not-allowed;
    opacity: 0.95;
}

.answer-card.selected {
    border-color: var(--kids-primary);
    box-shadow: 0 12px 24px rgba(108, 99, 255, 0.18);
}

.answer-card.correct {
    border-color: #3dbb6a;
    background: #ecfff3;
    color: #176433;
    box-shadow: 0 12px 24px rgba(61, 187, 106, 0.16);
}

.answer-card.wrong {
    border-color: #ff7a7a;
    background: #fff0f0;
    color: #8e2b2b;
    box-shadow: 0 12px 24px rgba(255, 122, 122, 0.14);
}

.completion-box {
    max-width: 480px;
    margin: 0 auto;
    border-radius: 20px;
    background: #fff8d9;
    padding: 18px;
    display: grid;
    gap: 10px;
}
</style>