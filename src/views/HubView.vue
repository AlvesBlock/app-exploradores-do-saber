<template>
  <div class="kids-page">
    <div class="kids-container">
      <div class="kids-card p-4 md:p-6 mb-4">
        <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-4">
          <div class="flex align-items-center gap-3">
            <div class="hub-avatar">{{ avatarEmoji }}</div>

            <div>
              <h1 class="kids-title mb-1">Olá, {{ profile?.name }}! 👋</h1>
              <p class="kids-subtitle mb-0">
                Siga a trilha da aventura, complete os mundos e ganhe estrelas estudando brincando.
              </p>
            </div>
          </div>

          <div class="stars-box">
            <span class="text-xl">⭐</span>
            <strong>{{ profile?.stars ?? 0 }}</strong>
            <span>estrelas</span>
          </div>
        </div>
      </div>

      <div class="grid">

        <div v-for="(module, index) in modulesWithProgress" :key="module.id" class="col-12 md:col-6 xl:col-3">
          <div class="module-card h-full" :class="{
            completed: module.isCompleted,
            next: module.isNext,
            locked: !module.unlocked
          }" :style="{ borderTop: `8px solid ${module.color}` }">
            <div class="module-order-badge">
              {{ index + 1 }}
            </div>

            <div class="module-status mb-3">
              <span v-if="module.isCompleted" class="status-chip completed">Concluído</span>
              <span v-else-if="module.isNext" class="status-chip next">Próximo</span>
              <span v-else class="status-chip locked">Bloqueado</span>
            </div>

            <div class="text-5xl mb-3">{{ module.emoji }}</div>

            <h2 class="text-xl font-bold mb-2">{{ module.title }}</h2>
            <p class="module-description mb-4">{{ module.description }}</p>

            <div class="mb-3">
              <div class="text-sm font-semibold mb-2">
                Progresso: {{ module.completedPhases }}/{{ module.totalPhases }} fases
              </div>
              <ProgressBar :value="module.progressPercent" style="height: 14px" />
            </div>

            <div class="text-sm mb-4">
              ⭐ {{ module.earnedStars }} estrela(s) neste módulo
            </div>

            <Button v-if="module.unlocked" :label="module.isCompleted ? 'Revisar módulo' : 'Jogar agora'"
              icon="pi pi-play" class="w-full" @click="openModule(module.id)" />

            <Button v-else label="Bloqueado" icon="pi pi-lock" class="w-full" severity="secondary" disabled />
          </div>
        </div>

      </div>

      <div class="mt-5 flex flex-column md:flex-row gap-3 justify-content-center">

        <Button label="Modo Arcade" icon="pi pi-bolt" @click="openRunner" />

        <Button label="Meu pet" icon="pi pi-heart" @click="openPet" />

        <Button label="Trocar perfil" icon="pi pi-user-edit" severity="secondary" outlined @click="changeProfile" />

        <Button label="Resetar progresso" icon="pi pi-refresh" severity="danger" outlined @click="resetProgress" />
      </div>


    </div>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

import { gameModules } from '@/data/modules/modules.data'
import { moduleProgressService } from '@/services/moduleProgress.service'
import { playerProfileService } from '@/services/playerProfile.service'
import type { ModuleId, ModuleProgress } from '@/types/module'
import type { PlayerProfile } from '@/types/player'
import { petService } from '@/services/pet.service'

const router = useRouter()
const toast = useToast()

const profile = ref<PlayerProfile | null>(null)
const progressList = ref<ModuleProgress[]>([])


const modulesWithProgress = computed(() => {
  return gameModules.map((module) => {
    const progress = progressList.value.find((item) => item.moduleId === module.id)

    const completedPhases = progress?.completedPhases ?? 0
    const earnedStars = progress?.earnedStars ?? 0
    const unlocked = progress?.unlocked ?? false
    const isCompleted = completedPhases >= module.totalPhases
    const isNext = unlocked && !isCompleted

    return {
      ...module,
      completedPhases,
      earnedStars,
      unlocked,
      isCompleted,
      isNext,
      progressPercent: Math.round((completedPhases / module.totalPhases) * 100)
    }
  })
})


const avatarEmoji = computed(() => {
  if (!profile.value) return '🙂'

  const map = {
    coelho: '🐰',
    cientista: '🧪',
    menino: '🧒',
    menina: '👧'
  }

  return map[profile.value.avatar]
})

function loadData() {
  const data = playerProfileService.get()

  if (!data) {
    router.replace('/onboarding')
    return
  }

  profile.value = data
  progressList.value = moduleProgressService.getAll()
}

function changeProfile() {
  router.push('/onboarding')
}

function openModule(moduleId: ModuleId) {
  router.push(`/module/${moduleId}`)
}

function openRunner() {
  router.push('/runner')
}


function openPet() {
  router.push('/pet')
}

function resetProgress() {
  moduleProgressService.reset()

  const currentProfile = playerProfileService.get()
  if (currentProfile) {
    playerProfileService.save({
      ...currentProfile,
      stars: 0
    })
  }

  petService.reset()

  progressList.value = moduleProgressService.getAll()
  profile.value = playerProfileService.get()

  toast.add({
    severity: 'success',
    summary: 'Progresso resetado',
    detail: 'As fases e estrelas foram reiniciadas.',
    life: 2500
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.hub-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff4cc;
  font-size: 2rem;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
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

.module-card {
  position: relative;
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  overflow: hidden;
}

.module-card:hover {
  transform: translateY(-4px);
}

.module-card.next {
  box-shadow: 0 14px 28px rgba(108, 99, 255, 0.16);
}

.module-card.completed {
  background: linear-gradient(180deg, #ffffff 0%, #f5fff7 100%);
}

.module-card.locked {
  opacity: 0.82;
}

.module-order-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f4f1ff;
  color: #5c52d6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.95rem;
}

.module-status {
  min-height: 28px;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.78rem;
  font-weight: 800;
}

.status-chip.completed {
  background: #e9fff0;
  color: #1a7a3f;
}

.status-chip.next {
  background: #f1ecff;
  color: #5c3fd6;
}

.status-chip.locked {
  background: #f0f2f5;
  color: #7a7f89;
}

.module-description {
  color: var(--kids-muted);
  min-height: 72px;
}
</style>