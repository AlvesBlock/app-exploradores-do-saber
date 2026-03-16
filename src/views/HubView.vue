<template>
  <div class="kids-page">
    <div class="kids-container hub-shell">
      <section class="kids-card hub-hero">
        <div class="hero-profile">
          <div class="hero-avatar" :style="{ '--avatar-accent': avatarMeta.accentColor }">
            {{ avatarMeta.emoji }}
          </div>

          <div class="hero-copy">
            <div class="kids-eyebrow">🚀 Central do explorador</div>
            <h1 class="kids-title">Ola, {{ profile?.name }}!</h1>
            <p class="kids-subtitle">
              Escolha um mundo, avance no plano de 5 dias e colete estrelas para celebrar seu
              progresso.
            </p>
          </div>
        </div>

        <div class="hero-summary">
          <div class="summary-card">
            <span>⭐</span>
            <strong>{{ profile?.stars ?? 0 }}</strong>
            <small>estrelas totais</small>
          </div>
          <div class="summary-card">
            <span>🏅</span>
            <strong>{{ overview.completedModules }}/{{ gameModules.length }}</strong>
            <small>modulos concluidos</small>
          </div>
          <div class="summary-card">
            <span>🎯</span>
            <strong>{{ Math.round(overview.averageAccuracy * 100) }}%</strong>
            <small>melhor precisao media</small>
          </div>
        </div>
      </section>

      <section class="hub-section">
        <div class="section-heading">
          <div>
            <div class="kids-eyebrow">📚 Trilhas de aprendizagem</div>
            <h2 class="kids-section-title">Continue de onde voce parou</h2>
          </div>
          <p class="kids-section-copy">
            Cada modulo libera uma nova jornada quando a anterior e concluida.
          </p>
        </div>

        <div class="module-grid">
          <article
            v-for="module in modulesWithProgress"
            :key="module.id"
            class="kids-card module-card"
            :class="{ locked: !module.unlocked, completed: module.isCompleted }"
            :style="{ '--module-color': module.color, '--module-gradient': module.gradient }"
          >
            <div class="module-header">
              <div class="module-icon">{{ module.emoji }}</div>
              <span
                class="kids-chip"
                :class="module.isCompleted ? 'success' : module.unlocked ? 'info' : 'neutral'"
              >
                {{ module.statusLabel }}
              </span>
            </div>

            <div class="module-copy">
              <h3>{{ module.title }}</h3>
              <p>{{ module.description }}</p>
            </div>

            <div class="module-meta">
              <div class="meta-row">
                <span>Dia {{ module.displayDay }}/{{ module.totalDays }}</span>
                <span>{{ Math.round(module.progressPercent) }}%</span>
              </div>
              <div class="kids-progress-bar">
                <div class="kids-progress-fill" :style="{ width: `${module.progressPercent}%` }"></div>
              </div>

              <div class="meta-stats">
                <div class="kids-stat-pill"><span>⭐</span><span>{{ module.earnedStars }}</span></div>
                <div class="kids-stat-pill">
                  <span>🎯</span>
                  <span>{{ Math.round(module.bestAccuracy * 100) }}%</span>
                </div>
                <div class="kids-stat-pill"><span>🔥</span><span>{{ module.currentStreak }}</span></div>
              </div>
            </div>

            <ul class="module-goals">
              <li v-for="goal in module.learningMoments" :key="goal">{{ goal }}</li>
            </ul>

            <Button
              v-if="module.unlocked"
              :label="module.actionLabel"
              icon="pi pi-play"
              class="w-full"
              @click="openModule(module.id)"
            />
            <Button
              v-else
              label="Bloqueado"
              icon="pi pi-lock"
              class="w-full"
              severity="secondary"
              disabled
            />
          </article>
        </div>
      </section>

      <section class="kids-card quick-actions">
        <div>
          <div class="kids-eyebrow">⚡ Extras do app</div>
          <h2 class="kids-section-title">Escolha uma pausa divertida</h2>
        </div>

        <div class="action-grid">
          <button type="button" class="action-card" @click="openPet">
            <span>🐰</span>
            <strong>Meu pet</strong>
            <small>Use estrelas para cuidar do mascote.</small>
          </button>
          <button type="button" class="action-card" @click="openRunner">
            <span>🏎️</span>
            <strong>Modo Arcade</strong>
            <small>Entre no runner a qualquer momento.</small>
          </button>
          <button type="button" class="action-card" @click="changeProfile">
            <span>🧑‍🎨</span>
            <strong>Trocar perfil</strong>
            <small>Atualize nome e avatar quando quiser.</small>
          </button>
          <button type="button" class="action-card danger" @click="resetProgress">
            <span>🔄</span>
            <strong>Resetar jornada</strong>
            <small>Apaga modulos e estrelas do app principal.</small>
          </button>
        </div>
      </section>
    </div>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

import { getAvatarMeta } from '@/data/avatars/avatarOptions.data'
import { gameModules } from '@/data/modules/modules.data'
import { moduleProgressService } from '@/services/moduleProgress.service'
import { playerProfileService } from '@/services/playerProfile.service'
import { petService } from '@/services/pet.service'
import type { ModuleId, ModuleProgress } from '@/types/module'
import type { PlayerProfile } from '@/types/player'

const router = useRouter()
const toast = useToast()

const profile = ref<PlayerProfile | null>(null)
const progressList = ref<ModuleProgress[]>([])

const avatarMeta = computed(() => getAvatarMeta(profile.value?.avatar))
const overview = computed(() => moduleProgressService.getOverview())

const modulesWithProgress = computed(() => {
  return gameModules.map((module) => {
    const progress = progressList.value.find((item) => item.moduleId === module.id)
    const completedDays = progress?.completedDays ?? 0
    const progressPercent = (completedDays / module.totalDays) * 100
    const isCompleted = !!progress?.completedAt
    const displayDay = isCompleted ? module.totalDays : Math.min(completedDays + 1, module.totalDays)

    return {
      ...module,
      unlocked: progress?.unlocked ?? false,
      earnedStars: progress?.earnedStars ?? 0,
      bestAccuracy: progress?.bestAccuracy ?? 0,
      currentStreak: progress?.currentStreak ?? 0,
      progressPercent,
      completedDays,
      displayDay,
      isCompleted,
      statusLabel: isCompleted ? 'Concluido' : progress?.unlocked ? 'Em andamento' : 'Bloqueado',
      actionLabel: isCompleted ? 'Revisar modulo' : `Comecar dia ${displayDay}`
    }
  })
})

function loadData() {
  const data = playerProfileService.get()

  if (!data) {
    router.replace('/onboarding')
    return
  }

  playerProfileService.touchLastActive()
  profile.value = playerProfileService.get()
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
  petService.reset()

  const currentProfile = playerProfileService.get()
  if (currentProfile) {
    playerProfileService.save({
      ...currentProfile,
      stars: 0
    })
  }

  progressList.value = moduleProgressService.getAll()
  profile.value = playerProfileService.get()

  toast.add({
    severity: 'success',
    summary: 'Jornada reiniciada',
    detail: 'Os modulos foram resetados e o pet voltou ao inicio.',
    life: 2600
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.hub-shell {
  display: grid;
  gap: 24px;
}

.hub-hero,
.quick-actions {
  padding: 24px;
}

.hub-hero {
  display: grid;
  gap: 20px;
}

.hero-profile {
  display: grid;
  gap: 16px;
}

.hero-avatar {
  width: 88px;
  height: 88px;
  border-radius: 28px;
  display: grid;
  place-items: center;
  font-size: 2.5rem;
  background: color-mix(in srgb, var(--avatar-accent) 20%, white);
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.1);
}

.hero-copy {
  display: grid;
  gap: 10px;
}

.hero-summary {
  display: grid;
  gap: 12px;
}

.summary-card {
  padding: 18px;
  border-radius: 22px;
  background: rgba(248, 250, 252, 0.92);
  display: grid;
  gap: 6px;
  justify-items: start;
}

.summary-card span:first-child {
  font-size: 1.5rem;
}

.summary-card strong {
  font-size: 1.6rem;
}

.summary-card small,
.section-heading p,
.module-copy p,
.action-card small {
  color: var(--kids-muted);
  line-height: 1.45;
}

.hub-section {
  display: grid;
  gap: 18px;
}

.section-heading {
  display: grid;
  gap: 10px;
}

.module-grid,
.action-grid {
  display: grid;
  gap: 16px;
}

.module-card {
  padding: 20px;
  display: grid;
  gap: 14px;
  background: var(--module-gradient);
}

.module-card.locked {
  opacity: 0.72;
}

.module-card.completed {
  box-shadow: 0 24px 46px rgba(16, 185, 129, 0.12);
}

.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.module-icon {
  width: 58px;
  height: 58px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.88);
  font-size: 1.9rem;
}

.module-copy {
  display: grid;
  gap: 8px;
}

.module-copy h3,
.action-card strong {
  margin: 0;
  font-size: 1.18rem;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-weight: 800;
  color: #27445e;
  margin-bottom: 8px;
}

.meta-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.module-goals {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: #41586d;
}

.quick-actions {
  display: grid;
  gap: 18px;
}

.action-card {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  padding: 18px;
  display: grid;
  gap: 8px;
  text-align: left;
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.08);
}

.action-card span {
  font-size: 1.8rem;
}

.action-card.danger {
  background: #fff7f7;
}

@media (min-width: 860px) {
  .hub-hero {
    grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
    align-items: center;
  }

  .hero-profile {
    grid-template-columns: auto 1fr;
    align-items: center;
  }

  .hero-summary {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .module-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1180px) {
  .module-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .action-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>

