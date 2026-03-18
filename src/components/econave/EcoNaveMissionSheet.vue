<template>
  <section class="mission-sheet" :class="{ open }" aria-label="Painel da missao orbital">
    <div class="mission-sheet__handle"></div>

    <div class="mission-sheet__grid">
      <article class="mission-card">
        <span class="mission-card__eyebrow">Plano da fase</span>
        <strong>{{ stage.title }}</strong>
        <p>{{ stage.description }}</p>

        <div class="mission-card__goals">
          <div class="mission-goal">
            <span>♻️ Coleta</span>
            <strong>{{ hud.collectedCorrect }}/{{ hud.collectTarget }}</strong>
          </div>
          <div class="mission-goal">
            <span>⚠️ Neutralizacao</span>
            <strong>{{ hud.neutralizedHazards }}/{{ hud.neutralizeTarget }}</strong>
          </div>
          <div class="mission-goal">
            <span>🛰️ Protecao</span>
            <strong>{{ hud.protectedSatellites }}/{{ hud.protectTarget }}</strong>
          </div>
          <div class="mission-goal">
            <span>🌱 EcoScore</span>
            <strong>{{ hud.ecoScore }}/{{ hud.ecoScoreTarget }}</strong>
          </div>
        </div>

        <ul class="mission-card__list">
          <li v-for="line in stage.missionLines" :key="line">{{ line }}</li>
        </ul>
      </article>

      <article class="mission-card compact">
        <span class="mission-card__eyebrow">Nave ativa</span>
        <strong>{{ ship.name }}</strong>
        <p>{{ ship.educationalBenefit }}</p>

        <div class="ship-stat-list">
          <div class="ship-stat">
            <span>Velocidade</span>
            <strong>{{ ship.stats.moveSpeed.toFixed(2) }}</strong>
          </div>
          <div class="ship-stat">
            <span>Energia</span>
            <strong>{{ ship.stats.maxEnergy }}</strong>
          </div>
          <div class="ship-stat">
            <span>Pulso</span>
            <strong>{{ ship.stats.startingPulseCharges }}</strong>
          </div>
          <div class="ship-stat">
            <span>Cadencia</span>
            <strong>{{ ship.stats.fireCooldownMs }}ms</strong>
          </div>
        </div>

        <div class="effects-list">
          <span v-for="effect in activeEffects" :key="effect.id" class="kids-chip info">{{ effect.label }}</span>
          <span v-if="activeEffects.length === 0" class="kids-chip neutral">Nenhum efeito ativo agora</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { EcoNaveHudSnapshot, EcoNaveShipConfig, EcoNaveStageConfig } from '@/types/econave'

const props = defineProps<{
  open: boolean
  stage: EcoNaveStageConfig
  ship: EcoNaveShipConfig
  hud: EcoNaveHudSnapshot
}>()

const activeEffects = computed(() => {
  const effects = props.hud.activeEffects

  return [
    effects.magnetMs > 0
      ? { id: 'magnet', label: `Ima de coleta ${Math.ceil(effects.magnetMs / 1000)}s` }
      : null,
    effects.classifierMs > 0
      ? { id: 'classifier', label: `Camera de classificacao ${Math.ceil(effects.classifierMs / 1000)}s` }
      : null,
    effects.turboMs > 0
      ? { id: 'turbo', label: `Turbo solar ${Math.ceil(effects.turboMs / 1000)}s` }
      : null,
    effects.slowMs > 0
      ? { id: 'slow', label: `Tempo desacelerado ${Math.ceil(effects.slowMs / 1000)}s` }
      : null
  ].filter(Boolean) as Array<{ id: string; label: string }>
})
</script>

<style scoped>
.mission-sheet {
  position: absolute;
  inset: auto 0 0 0;
  z-index: 8;
  padding: 14px 14px calc(14px + env(safe-area-inset-bottom));
  transform: translateY(calc(100% - 108px));
  transition:
    transform 220ms ease,
    opacity 220ms ease;
  opacity: 0.98;
  pointer-events: none;
}

.mission-sheet.open {
  transform: translateY(0);
  pointer-events: auto;
}

.mission-sheet__handle {
  width: 72px;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.4);
  margin: 0 auto 12px;
}

.mission-sheet__grid {
  display: grid;
  gap: 12px;
}

.mission-card {
  display: grid;
  gap: 14px;
  padding: 16px;
  border-radius: 24px;
  background: rgba(5, 12, 29, 0.84);
  color: #f8fbff;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
  box-shadow: 0 -12px 42px rgba(2, 6, 23, 0.22);
}

.mission-card.compact {
  background: rgba(8, 18, 41, 0.92);
}

.mission-card strong,
.mission-card p {
  margin: 0;
}

.mission-card p,
.mission-card__list {
  color: rgba(226, 232, 240, 0.88);
  line-height: 1.55;
}

.mission-card__eyebrow {
  color: rgba(191, 219, 254, 0.92);
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.mission-card__goals,
.ship-stat-list,
.effects-list {
  display: grid;
  gap: 10px;
}

.mission-card__goals {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.mission-goal,
.ship-stat {
  display: grid;
  gap: 6px;
  padding: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
}

.mission-goal span,
.ship-stat span {
  color: rgba(191, 219, 254, 0.84);
  font-size: 0.82rem;
}

.mission-card__list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
}

.effects-list {
  display: flex;
  flex-wrap: wrap;
}

@media (min-width: 760px) {
  .mission-sheet {
    left: auto;
    right: 16px;
    bottom: 16px;
    width: min(460px, calc(100% - 32px));
    padding: 0;
    transform: translateY(calc(100% - 96px));
  }

  .mission-sheet__grid {
    gap: 10px;
  }
}
</style>
