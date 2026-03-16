<template>
  <div class="kids-page onboarding-page">
    <div class="kids-container onboarding-shell">
      <section class="kids-card onboarding-intro">
        <div class="intro-copy">
          <div class="kids-eyebrow">🪄 Perfil de explorador</div>
          <h1 class="kids-title">Crie um perfil acolhedor e pronto para brincar</h1>
          <p class="kids-subtitle">
            Escolha um nome curtinho, um avatar que combine com a sua energia e comece a jornada.
          </p>
        </div>

        <div class="preview-card" :style="{ '--avatar-accent': selectedAvatarMeta.accentColor }">
          <span class="preview-emoji">{{ selectedAvatarMeta.emoji }}</span>
          <strong>{{ playerNamePreview }}</strong>
          <small>{{ selectedAvatarMeta.description }}</small>
        </div>
      </section>

      <section class="kids-card onboarding-form">
        <div class="form-field">
          <label for="player-name" class="field-label">Como voce quer ser chamado?</label>
          <InputText
            id="player-name"
            v-model="playerName"
            class="w-full"
            size="large"
            placeholder="Ex: Bia, Caio, Sol..."
            maxlength="20"
          />
          <small class="field-help">Use um nome curto para ficar facil de ler no app.</small>
        </div>

        <div class="form-field">
          <div class="field-header">
            <label class="field-label">Escolha seu avatar</label>
            <span class="kids-chip neutral">6 opcoes inclusivas</span>
          </div>

          <div class="avatar-grid">
            <AvatarOptionCard
              v-for="option in avatarOptions"
              :key="option.value"
              :option="option"
              :selected="selectedAvatar === option.value"
              @click="selectAvatar(option.value)"
            />
          </div>
        </div>

        <div class="onboarding-actions">
          <Button
            label="Voltar"
            icon="pi pi-arrow-left"
            severity="secondary"
            outlined
            @click="goHome"
          />
          <Button
            label="Salvar e entrar"
            icon="pi pi-check"
            :disabled="!canContinue"
            @click="saveProfile"
          />
        </div>
      </section>
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

import AvatarOptionCard from '@/components/onboarding/AvatarOptionCard.vue'
import { avatarOptions, getAvatarMeta } from '@/data/avatars/avatarOptions.data'
import { playerProfileService } from '@/services/playerProfile.service'
import type { AvatarOption } from '@/types/player'

const router = useRouter()
const toast = useToast()

const playerName = ref('')
const selectedAvatar = ref<AvatarOption>('mascote-coelho')

const canContinue = computed(() => playerName.value.trim().length >= 2)
const selectedAvatarMeta = computed(() => getAvatarMeta(selectedAvatar.value))
const playerNamePreview = computed(() => playerName.value.trim() || 'Seu explorador')

function goHome() {
  router.push('/')
}

function selectAvatar(avatar: AvatarOption) {
  selectedAvatar.value = avatar
}

function saveProfile() {
  if (!canContinue.value) {
    toast.add({
      severity: 'warn',
      summary: 'Falta um passo',
      detail: 'Digite um nome com pelo menos 2 letras para continuar.',
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
    detail: 'Tudo pronto para comecar a trilha dos exploradores.',
    life: 2200
  })

  window.setTimeout(() => {
    router.push('/hub')
  }, 450)
}
</script>

<style scoped>
.onboarding-shell {
  display: grid;
  gap: 24px;
}

.onboarding-intro,
.onboarding-form {
  padding: 24px;
}

.onboarding-intro {
  display: grid;
  gap: 18px;
}

.intro-copy {
  display: grid;
  gap: 14px;
}

.preview-card {
  border-radius: 28px;
  padding: 22px;
  display: grid;
  gap: 10px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 252, 0.92) 100%);
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.preview-emoji {
  width: 72px;
  height: 72px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  font-size: 2.4rem;
  background: color-mix(in srgb, var(--avatar-accent) 18%, white);
}

.preview-card strong {
  font-size: 1.2rem;
}

.preview-card small,
.field-help {
  color: var(--kids-muted);
  line-height: 1.45;
}

.onboarding-form {
  display: grid;
  gap: 24px;
}

.form-field {
  display: grid;
  gap: 12px;
}

.field-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.field-label {
  font-weight: 900;
  color: #163047;
}

.avatar-grid {
  display: grid;
  gap: 14px;
}

.onboarding-actions {
  display: grid;
  gap: 12px;
}

@media (min-width: 760px) {
  .avatar-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .onboarding-actions {
    grid-template-columns: repeat(2, minmax(0, max-content));
    justify-content: end;
  }
}

@media (min-width: 1100px) {
  .onboarding-shell {
    grid-template-columns: minmax(320px, 0.95fr) minmax(0, 1.05fr);
    align-items: start;
  }
}
</style>

