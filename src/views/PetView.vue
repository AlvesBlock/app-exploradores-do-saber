<template>
  <div class="kids-page">
    <div class="kids-container">
      <div class="kids-card p-4 md:p-6 mb-4">
        <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-4">
          <div>
            <div class="world-chip mb-2">Mascote da aventura</div>
            <h1 class="kids-title mb-2">Meu Pet Virtual</h1>
            <p class="kids-subtitle mb-0">
              Cuide do seu mascote usando as estrelas ganhas nos estudos.
            </p>
          </div>

          <div class="stars-box">
            <span class="text-xl">⭐</span>
            <strong>{{ totalStars }}</strong>
            <span>estrelas</span>
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="col-12 lg:col-5">
          <div class="kids-card pet-stage p-4 md:p-6">
            <div class="pet-emoji">{{ pet.emoji }}</div>
            <h2 class="text-2xl font-bold mb-2">{{ pet.name }}</h2>
            <p class="pet-mood mb-0">{{ moodLabel }}</p>
          </div>
        </div>

        <div class="col-12 lg:col-7">
          <div class="kids-card p-4 md:p-6">
            <div class="mb-4">
              <div class="stat-label">Felicidade</div>
              <ProgressBar :value="pet.happiness" style="height: 16px" />
            </div>

            <div class="mb-4">
              <div class="stat-label">Energia</div>
              <ProgressBar :value="pet.energy" style="height: 16px" />
            </div>

            <div class="mb-4">
              <div class="stat-label">Lanches recebidos</div>
              <div class="snack-badge">🍎 {{ pet.snacks }}</div>
            </div>

            <div class="flex flex-column md:flex-row gap-3 mt-4">
              <Button
                label="Dar lanche (1 estrela)"
                icon="pi pi-star"
                @click="feedPet"
              />

              <Button
                label="Brincar"
                icon="pi pi-heart"
                severity="secondary"
                outlined
                @click="playWithPet"
              />

              <Button
                label="Descansar"
                icon="pi pi-moon"
                severity="secondary"
                outlined
                @click="restPet"
              />
            </div>

            <div class="mt-4">
              <Button
                label="Voltar ao hub"
                icon="pi pi-arrow-left"
                severity="secondary"
                outlined
                @click="goHub"
              />
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
import ProgressBar from 'primevue/progressbar'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

import { petService } from '@/services/pet.service'
import { playerProfileService } from '@/services/playerProfile.service'
import type { PetState } from '@/types/pet'

const router = useRouter()
const toast = useToast()

const pet = ref<PetState>(petService.get())
const totalStars = ref(playerProfileService.get()?.stars ?? 0)

const moodLabel = computed(() => {
  if (pet.value.happiness >= 85) return 'Muito feliz e animado! ✨'
  if (pet.value.happiness >= 65) return 'Feliz e pronto para brincar! 😊'
  if (pet.value.happiness >= 40) return 'Está bem, mas quer mais atenção 💛'
  return 'Está tristinho e precisa de cuidado 🥺'
})

function syncAll() {
  pet.value = petService.get()
  totalStars.value = playerProfileService.get()?.stars ?? 0
}

function feedPet() {
  const result = petService.feedWithStars()

  if (!result.ok) {
    toast.add({
      severity: 'warn',
      summary: 'Ops!',
      detail: result.message,
      life: 2400
    })
    return
  }

  syncAll()

  toast.add({
    severity: 'success',
    summary: 'Que delícia!',
    detail: `${pet.value.name} recebeu um lanchinho e ficou mais feliz.`,
    life: 2200
  })
}

function playWithPet() {
  petService.play()
  syncAll()

  toast.add({
    severity: 'success',
    summary: 'Hora da brincadeira!',
    detail: `${pet.value.name} brincou bastante com você.`,
    life: 2200
  })
}

function restPet() {
  petService.rest()
  syncAll()

  toast.add({
    severity: 'info',
    summary: 'Hora de descansar',
    detail: `${pet.value.name} recuperou energia.`,
    life: 2200
  })
}

function goHub() {
  router.push('/hub')
}
</script>

<style scoped>
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

.stars-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff8d9;
  border-radius: 999px;
  padding: 14px 18px;
  font-size: 1rem;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.05);
}

.pet-stage {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(180deg, #fffaf0 0%, #eef8ff 100%);
}

.pet-emoji {
  font-size: 6rem;
  line-height: 1;
  margin-bottom: 16px;
}

.pet-mood {
  color: var(--kids-muted);
  font-weight: 700;
}

.stat-label {
  font-weight: 700;
  margin-bottom: 8px;
}

.snack-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff3d6;
  color: #7b5200;
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 700;
}
</style>