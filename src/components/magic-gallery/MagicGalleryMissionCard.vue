<template>
  <article class="kids-card mission-card">
    <div class="mission-top">
      <div class="mission-icon">{{ mission.icon }}</div>
      <div class="mission-copy">
        <strong>{{ mission.title }}</strong>
        <p>{{ mission.description }}</p>
      </div>
    </div>

    <div class="mission-progress">
      <div class="mission-progress-row">
        <span>{{ mission.progress }}/{{ mission.target }}</span>
        <span>{{ mission.completed ? 'Concluida' : 'Em andamento' }}</span>
      </div>
      <div class="kids-progress-bar">
        <div class="kids-progress-fill mission-fill" :style="{ width: `${progressPercent}%` }"></div>
      </div>
    </div>

    <div class="mission-footer">
      <div class="kids-stat-pill"><span>✨</span><span>{{ mission.reward.magicDust }} poeiras</span></div>
      <div class="kids-stat-pill"><span>⭐</span><span>{{ mission.reward.bonusStars }} estrelas</span></div>
      <Button
        :label="buttonLabel"
        :disabled="!canClaim"
        :severity="mission.completed && !mission.claimedAt ? undefined : 'secondary'"
        :outlined="!mission.completed || !!mission.claimedAt"
        @click="$emit('claim', mission.id)"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

import type { MagicGalleryMission } from '@/types/magic-gallery'

const props = defineProps<{
  mission: MagicGalleryMission
}>()

defineEmits<{
  claim: [missionId: string]
}>()

const progressPercent = computed(() => (props.mission.progress / props.mission.target) * 100)
const canClaim = computed(() => props.mission.completed && !props.mission.claimedAt)
const buttonLabel = computed(() => {
  if (props.mission.claimedAt) return 'Resgatada'
  if (props.mission.completed) return 'Resgatar'
  return 'Continue'
})
</script>

<style scoped>
.mission-card {
  padding: 18px;
  display: grid;
  gap: 16px;
}

.mission-top,
.mission-progress,
.mission-copy,
.mission-footer {
  display: grid;
  gap: 10px;
}

.mission-top {
  grid-template-columns: auto 1fr;
  align-items: start;
}

.mission-icon {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-size: 1.6rem;
  background: linear-gradient(135deg, #dbeafe 0%, #fae8ff 100%);
}

.mission-copy strong {
  font-size: 1.05rem;
}

.mission-copy p {
  margin: 0;
  color: #5f7389;
  line-height: 1.5;
}

.mission-progress-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-weight: 800;
}

.mission-fill {
  background: linear-gradient(90deg, #f59e0b 0%, #2563eb 100%);
}

.mission-footer {
  justify-items: start;
}

@media (min-width: 860px) {
  .mission-footer {
    grid-template-columns: repeat(3, max-content);
    align-items: center;
  }
}
</style>
