<template>
  <button
    type="button"
    class="quiz-option-card"
    :class="[state, { disabled }]"
    :disabled="disabled"
  >
    <span class="quiz-option-badge">{{ option.emoji ?? '✨' }}</span>
    <span class="quiz-option-copy">
      <strong>{{ option.label }}</strong>
      <small v-if="option.helperText">{{ option.helperText }}</small>
    </span>
  </button>
</template>

<script setup lang="ts">
import type { AnswerOption } from '@/types/module'

defineProps<{
  option: AnswerOption
  state: '' | 'selected' | 'correct' | 'wrong'
  disabled: boolean
}>()
</script>

<style scoped>
.quiz-option-card {
  width: 100%;
  border: 2px solid rgba(148, 163, 184, 0.18);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  min-height: 88px;
  padding: 16px 18px;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 14px;
  text-align: left;
  box-shadow: 0 18px 28px rgba(15, 23, 42, 0.07);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease;
}

.quiz-option-card:hover:not(.disabled) {
  transform: translateY(-2px);
}

.quiz-option-card.selected {
  border-color: #2563eb;
  box-shadow: 0 18px 32px rgba(37, 99, 235, 0.16);
}

.quiz-option-card.correct {
  border-color: #10b981;
  background: #ecfdf5;
  color: #065f46;
  box-shadow: 0 18px 32px rgba(16, 185, 129, 0.14);
}

.quiz-option-card.wrong {
  border-color: #ef4444;
  background: #fef2f2;
  color: #991b1b;
  box-shadow: 0 18px 32px rgba(239, 68, 68, 0.14);
}

.quiz-option-card.disabled {
  cursor: not-allowed;
}

.quiz-option-badge {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(191, 219, 254, 0.48);
  font-size: 1.5rem;
}

.quiz-option-copy {
  display: grid;
  gap: 4px;
}

strong {
  font-size: 1rem;
}

small {
  color: #64748b;
  line-height: 1.35;
}
</style>

