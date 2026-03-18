<template>
  <article class="kids-card premium-card" :class="status.status">
    <div class="premium-glow" aria-hidden="true"></div>

    <div class="premium-header">
      <div class="premium-copy">
        <span class="premium-plus-badge">PLUS</span>
        <div class="premium-title-row">
          <h3>Galeria Encantada</h3>
          <span v-if="status.status === 'just-unlocked'" class="premium-new-badge">novo</span>
        </div>
        <p>{{ status.requirementText }}</p>
      </div>

      <div class="premium-portal" aria-hidden="true">
        <span>✨</span>
      </div>
    </div>

    <div class="premium-progress">
      <div class="premium-progress-row">
        <span>{{ status.completedRequiredModules }}/{{ status.totalRequiredModules }} mundos</span>
        <span>{{ Math.round(status.progressPercent) }}%</span>
      </div>
      <div class="kids-progress-bar premium-progress-bar">
        <div
          class="kids-progress-fill premium-progress-fill"
          :style="{ width: `${status.progressPercent}%` }"
        ></div>
      </div>
    </div>

    <div class="premium-stats">
      <div class="kids-stat-pill">
        <span>🖼️</span><span>{{ unlockedCharacters }}/{{ totalCharacters }}</span>
      </div>
      <div class="kids-stat-pill">
        <span>✨</span><span>{{ magicDust }} poeira magica</span>
      </div>
      <div class="kids-stat-pill">
        <span>👑</span><span>{{ statusLabel }}</span>
      </div>
    </div>

    <p class="premium-helper">{{ status.helperText }}</p>

    <div class="premium-actions">
      <Button
        :label="status.ctaLabel"
        :icon="canEnter ? 'pi pi-sparkles' : 'pi pi-lock'"
        class="premium-action-button"
        :disabled="!canEnter"
        @click="$emit('open')"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

import type { MagicGalleryUnlockStatus } from '@/types/magic-gallery'

const props = defineProps<{
  status: MagicGalleryUnlockStatus
  unlockedCharacters: number
  totalCharacters: number
  magicDust: number
}>()

defineEmits<{
  open: []
}>()

const canEnter = computed(() => props.status.unlocked)

const statusLabel = computed(() => {
  switch (props.status.status) {
    case 'locked':
      return 'bloqueado'
    case 'almost-unlocked':
    case 'just-unlocked':
      return 'liberado'
    case 'available':
      return 'pronto'
    case 'visited':
      return 'em aventura'
    default:
      return 'bloqueado'
  }
})
</script>

<style scoped>
.premium-card {
  position: relative;
  overflow: hidden;
  padding: 22px;
  display: grid;
  gap: 16px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.94), transparent 35%),
    linear-gradient(
      135deg,
      rgba(29, 78, 216, 0.12) 0%,
      rgba(217, 70, 239, 0.16) 48%,
      rgba(251, 191, 36, 0.18) 100%
    );
}

.premium-card.locked,
.premium-card.almost-unlocked {
  border-color: rgba(147, 51, 234, 0.2);
}

.premium-card.just-unlocked,
.premium-card.available,
.premium-card.visited {
  border-color: rgba(245, 158, 11, 0.36);
  box-shadow:
    0 24px 48px rgba(147, 51, 234, 0.16),
    0 0 0 1px rgba(255, 255, 255, 0.42) inset;
}

.premium-glow {
  position: absolute;
  inset: -25% auto auto 60%;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(250, 204, 21, 0.36) 0%, transparent 68%);
  filter: blur(12px);
  pointer-events: none;
}

.premium-header,
.premium-progress-row,
.premium-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.premium-copy,
.premium-progress {
  display: grid;
  gap: 10px;
}

.premium-plus-badge,
.premium-new-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.premium-plus-badge {
  color: #6d28d9;
  background: rgba(255, 255, 255, 0.86);
}

.premium-new-badge {
  color: #9a3412;
  background: #fef3c7;
}

.premium-title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.premium-title-row h3 {
  margin: 0;
  font-size: 1.35rem;
}

.premium-copy p,
.premium-helper {
  margin: 0;
  color: #4b5f74;
  line-height: 1.55;
}

.premium-portal {
  width: 72px;
  height: 72px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.96), transparent 34%),
    linear-gradient(135deg, #4338ca 0%, #7c3aed 52%, #f59e0b 100%);
  box-shadow: 0 20px 36px rgba(91, 33, 182, 0.22);
}

.premium-portal span {
  font-size: 1.9rem;
  color: white;
}

.premium-progress-bar {
  background: rgba(148, 163, 184, 0.18);
}

.premium-progress-fill {
  background: linear-gradient(90deg, #facc15 0%, #a855f7 52%, #2563eb 100%);
}

.premium-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.premium-action-button {
  width: 100%;
}

@media (min-width: 860px) {
  .premium-action-button {
    width: auto;
    min-width: 220px;
  }
}

@media (max-width: 859px) {
  .premium-card {
    position: relative;
    padding: 22px;
    display: grid;
    gap: 16px;
    max-height: 80vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
