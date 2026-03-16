<template>
  <button
    type="button"
    class="avatar-option-card"
    :class="{ selected }"
    :style="{ '--avatar-accent': option.accentColor }"
  >
    <span class="avatar-option-emoji">{{ option.emoji }}</span>
    <strong>{{ option.label }}</strong>
    <small>{{ option.description }}</small>
  </button>
</template>

<script setup lang="ts">
import type { AvatarMeta } from '@/types/player'

defineProps<{
  option: AvatarMeta
  selected: boolean
}>()
</script>

<style scoped>
.avatar-option-card {
  width: 100%;
  border: 2px solid rgba(148, 163, 184, 0.16);
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
  padding: 18px 16px;
  display: grid;
  gap: 8px;
  justify-items: start;
  text-align: left;
  color: #19324a;
  box-shadow: 0 18px 32px rgba(15, 23, 42, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.avatar-option-card:hover {
  transform: translateY(-2px);
}

.avatar-option-card.selected {
  border-color: color-mix(in srgb, var(--avatar-accent) 64%, white);
  box-shadow:
    0 20px 36px rgba(15, 23, 42, 0.12),
    0 0 0 4px color-mix(in srgb, var(--avatar-accent) 18%, white);
}

.avatar-option-emoji {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-size: 2rem;
  background: color-mix(in srgb, var(--avatar-accent) 18%, white);
}

strong {
  font-size: 1rem;
}

small {
  color: #5f7288;
  line-height: 1.4;
}
</style>

