<template>
    <div class="kids-page landing-page">
        <div class="kids-container">
            <div class="landing-hero kids-card p-4 md:p-6">
                <div class="grid align-items-center">
                    <div class="col-12 md:col-7">
                        <div class="mb-3 text-5xl">🚀✨📚</div>

                        <h1 class="kids-title mb-3">Exploradores do Saber</h1>

                        <p class="kids-subtitle landing-text">
                            Um app de revisão gamificada para aprender brincando com desafios,
                            estrelas, aventuras e muita descoberta.
                        </p>

                        <div class="flex flex-column md:flex-row gap-3 mt-4">
                            <Button label="Começar aventura" icon="pi pi-play" size="large" @click="goStart" />

                            <Button label="Área dos pais" icon="pi pi-lock" severity="secondary" outlined size="large"
                                @click="openParentsArea" />
                        </div>
                    </div>

                    <div class="col-12 md:col-5">
                        <div class="hero-illustration">
                            <div class="floating-item">🐰</div>
                            <div class="floating-item">🔢</div>
                            <div class="floating-item">🧪</div>
                            <div class="floating-item">🛣️</div>
                            <div class="floating-item">📚</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Toast />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

import { playerProfileService } from '@/services/playerProfile.service'

const router = useRouter()
const toast = useToast()

function goStart() {
    if (playerProfileService.exists()) {
        router.push('/hub')
        return
    }

    router.push('/onboarding')
}

function openParentsArea() {
    toast.add({
        severity: 'info',
        summary: 'Área dos pais',
        detail: 'Vamos construir essa tela nas próximas etapas.',
        life: 2500
    })
}
</script>

<style scoped>
.landing-page {
    display: flex;
    align-items: center;
}

.landing-hero {
    overflow: hidden;
}

.landing-text {
    max-width: 560px;
    line-height: 1.6;
}

.hero-illustration {
    min-height: 260px;
    border-radius: 28px;
    background: linear-gradient(135deg, #eef4ff 0%, #fff6df 100%);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 20px;
    place-items: center;
}

.floating-item {
    width: 86px;
    height: 86px;
    border-radius: 24px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}
</style>