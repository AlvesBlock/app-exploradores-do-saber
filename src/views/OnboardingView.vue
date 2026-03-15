<template>
    <div class="kids-page onboarding-page">
        <div class="kids-container">
            <div class="kids-card p-4 md:p-6">
                <div class="text-center mb-5">
                    <div class="text-5xl mb-3">✨</div>
                    <h1 class="kids-title mb-2">Seu perfil de explorador</h1>
                    <p class="kids-subtitle mb-0">
                        Escolha seu nome e seu avatar para começar a aventura.
                    </p>
                </div>

                <div class="grid">
                    <div class="col-12">
                        <label class="block mb-2 font-semibold">Seu nome ou apelido</label>
                        <InputText v-model="playerName" class="w-full" size="large"
                            placeholder="Ex: Esther, Davi, Sofia..." maxlength="20" />
                    </div>

                    <div class="col-12 mt-4">
                        <label class="block mb-3 font-semibold">Escolha seu avatar</label>

                        <div class="grid">
                            <div v-for="option in avatarOptions" :key="option.value" class="col-6 md:col-3">
                                <button type="button" class="avatar-option w-full"
                                    :class="{ selected: selectedAvatar === option.value }"
                                    @click="selectedAvatar = option.value">
                                    <div class="avatar-emoji mb-2">{{ option.emoji }}</div>
                                    <div class="font-semibold">{{ option.label }}</div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 mt-5">
                        <div class="flex flex-column md:flex-row gap-3 justify-content-center">
                            <Button label="Voltar" icon="pi pi-arrow-left" severity="secondary" outlined
                                @click="goHome" />
                            <Button label="Salvar e entrar" icon="pi pi-check" :disabled="!canContinue"
                                @click="saveProfile" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Toast />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

import { playerProfileService } from '@/services/playerProfile.service'
import type { AvatarOption } from '@/types/player'

const router = useRouter()
const toast = useToast()

const playerName = ref('')
const selectedAvatar = ref<AvatarOption | null>(null)

const avatarOptions: Array<{ value: AvatarOption; label: string; emoji: string }> = [
    { value: 'coelho', label: 'Coelho', emoji: '🐰' },
    { value: 'cientista', label: 'Cientista', emoji: '🧪' },
    { value: 'menino', label: 'Menino', emoji: '🧒' },
    { value: 'menina', label: 'Menina', emoji: '👧' }
]

const canContinue = computed(() => {
    return playerName.value.trim().length >= 2 && !!selectedAvatar.value
})

function goHome() {
    router.push('/')
}

function saveProfile() {
    if (!canContinue.value || !selectedAvatar.value) {
        toast.add({
            severity: 'warn',
            summary: 'Falta um passo',
            detail: 'Digite seu nome e escolha um avatar.',
            life: 2500
        })
        return
    }

    playerProfileService.save({
        name: playerName.value.trim(),
        avatar: selectedAvatar.value,
        stars: 0
    })

    toast.add({
        severity: 'success',
        summary: 'Perfil salvo!',
        detail: 'Tudo pronto para começar a aventura.',
        life: 2200
    })

    setTimeout(() => {
        router.push('/hub')
    }, 500)
}
</script>

<style scoped>
.onboarding-page {
    display: flex;
    align-items: center;
}

.avatar-option {
    border: 3px solid transparent;
    border-radius: 24px;
    padding: 18px 12px;
    background: #fff;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        border-color 0.2s ease;
}

.avatar-option:hover {
    transform: translateY(-2px);
}

.avatar-option.selected {
    border-color: var(--kids-primary);
    box-shadow: 0 12px 24px rgba(108, 99, 255, 0.18);
}

.avatar-emoji {
    font-size: 3rem;
}
</style>