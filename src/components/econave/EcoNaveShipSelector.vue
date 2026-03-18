<template>
  <section class="ship-selector">
    <header class="selector-header">
      <div>
        <div class="kids-eyebrow">Frota eco</div>
        <h2 class="kids-section-title">Escolha a nave da missao</h2>
      </div>
      <span class="selector-caption">{{ ecoCredits }} eco-creditos disponiveis</span>
    </header>

    <div class="ship-rail" aria-label="Seletor de naves">
      <button
        v-for="ship in ships"
        :key="ship.id"
        type="button"
        class="ship-card"
        :class="{
          active: ship.id === selectedShipId,
          locked: !unlockedShipIds.includes(ship.id)
        }"
        :style="{ '--ship-gradient': ship.gradient, '--ship-accent': ship.accentColor }"
        @click="$emit('select', ship.id)"
      >
        <div class="ship-card__top">
          <div class="ship-card__emoji">{{ ship.emoji }}</div>
          <span class="kids-chip" :class="unlockedShipIds.includes(ship.id) ? 'success' : 'warning'">
            {{ unlockedShipIds.includes(ship.id) ? 'Liberada' : `${ship.unlockCredits} creditos` }}
          </span>
        </div>

        <div class="ship-card__copy">
          <strong>{{ ship.name }}</strong>
          <p>{{ ship.description }}</p>
        </div>

        <small>{{ ship.educationalBenefit }}</small>

        <div class="ship-card__stats">
          <span>Velocidade {{ ship.stats.moveSpeed.toFixed(2) }}</span>
          <span>Energia {{ ship.stats.maxEnergy }}</span>
        </div>
      </button>
    </div>

    <article
      v-if="selectedShip"
      class="ship-focus"
      :style="{ '--ship-focus-gradient': selectedShip.gradient, '--ship-focus-accent': selectedShip.accentColor }"
    >
      <div class="ship-focus__hero">
        <div class="ship-focus__badge">{{ selectedShip.emoji }}</div>
        <div class="ship-focus__copy">
          <span class="ship-focus__eyebrow">Casco selecionado</span>
          <h3>{{ selectedShip.name }}</h3>
          <p>{{ selectedShip.description }}</p>
        </div>
      </div>

      <div class="ship-focus__chips">
        <span class="kids-chip" :class="isSelectedUnlocked ? 'success' : 'warning'">
          {{ isSelectedUnlocked ? 'Pronta para a missao' : `Libere com ${selectedShip.unlockCredits} creditos` }}
        </span>
        <span class="kids-chip info">{{ selectedShip.educationalBenefit }}</span>
      </div>

      <div class="ship-focus__stats">
        <div class="ship-stat">
          <span>Mobilidade</span>
          <div class="ship-stat__bar">
            <div class="ship-stat__fill" :style="{ width: `${Math.min(100, selectedShip.stats.moveSpeed * 180)}%` }"></div>
          </div>
        </div>
        <div class="ship-stat">
          <span>Cadencia</span>
          <div class="ship-stat__bar">
            <div class="ship-stat__fill" :style="{ width: `${Math.min(100, 100 - selectedShip.stats.fireCooldownMs / 3)}%` }"></div>
          </div>
        </div>
        <div class="ship-stat">
          <span>Resistencia</span>
          <div class="ship-stat__bar">
            <div class="ship-stat__fill" :style="{ width: `${Math.min(100, selectedShip.stats.maxEnergy / 1.25)}%` }"></div>
          </div>
        </div>
        <div class="ship-stat">
          <span>Pulso eco</span>
          <div class="ship-stat__bar">
            <div class="ship-stat__fill" :style="{ width: `${Math.min(100, selectedShip.stats.pulseRadius * 320)}%` }"></div>
          </div>
        </div>
      </div>

      <footer class="ship-focus__footer">
        <div class="ship-focus__perk">
          <strong>Bonus educativo</strong>
          <p>{{ selectedShip.educationalBenefit }}</p>
        </div>
        <Button
          :label="isSelectedUnlocked ? 'Usar esta nave' : 'Ainda bloqueada'"
          icon="pi pi-send"
          :disabled="!isSelectedUnlocked"
          @click="$emit('select', selectedShip.id)"
        />
      </footer>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

import type { EcoNaveShipConfig, EcoNaveShipId } from '@/types/econave'

const props = defineProps<{
  ships: EcoNaveShipConfig[]
  selectedShipId: EcoNaveShipId
  unlockedShipIds: EcoNaveShipId[]
  ecoCredits: number
}>()

defineEmits<{
  select: [shipId: EcoNaveShipId]
}>()

const selectedShip = computed(
  () => props.ships.find((ship) => ship.id === props.selectedShipId) ?? props.ships[0] ?? null,
)

const isSelectedUnlocked = computed(
  () => Boolean(selectedShip.value && props.unlockedShipIds.includes(selectedShip.value.id)),
)
</script>

<style scoped>
.ship-selector {
  display: grid;
  gap: 18px;
}

.selector-header {
  display: grid;
  gap: 10px;
}

.selector-caption {
  color: rgba(226, 232, 240, 0.76);
  line-height: 1.5;
}

.ship-rail {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(74%, 1fr);
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 4px;
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
}

.ship-card {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  padding: 18px;
  text-align: left;
  display: grid;
  gap: 14px;
  min-height: 228px;
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.78), rgba(12, 20, 45, 0.92)),
    var(--ship-gradient);
  background-blend-mode: soft-light, normal;
  color: #f8fbff;
  scroll-snap-align: start;
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.26);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
}

.ship-card:hover,
.ship-card:focus-visible {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.22);
  box-shadow: 0 24px 48px rgba(2, 6, 23, 0.32);
}

.ship-card.active {
  border-color: color-mix(in srgb, var(--ship-accent) 60%, white);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--ship-accent) 52%, white),
    0 26px 48px rgba(2, 6, 23, 0.34);
}

.ship-card.locked {
  opacity: 0.72;
}

.ship-card__top,
.ship-card__stats,
.ship-focus__hero,
.ship-focus__footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.ship-card__emoji,
.ship-focus__badge {
  width: 64px;
  height: 64px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.ship-card__copy {
  display: grid;
  gap: 8px;
}

.ship-card strong {
  font-size: 1.08rem;
}

.ship-card p,
.ship-card small,
.ship-focus__copy p,
.ship-focus__perk p {
  margin: 0;
  line-height: 1.55;
}

.ship-card p,
.ship-card small,
.ship-focus__copy p,
.ship-focus__perk p {
  color: rgba(226, 232, 240, 0.92);
}

.ship-card__stats {
  margin-top: auto;
  font-size: 0.92rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.86);
  flex-wrap: wrap;
}

.ship-focus {
  position: relative;
  overflow: hidden;
  border-radius: 30px;
  padding: 20px;
  display: grid;
  gap: 18px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
    linear-gradient(135deg, rgba(2, 6, 23, 0.8) 0%, rgba(9, 22, 51, 0.92) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 24px 52px rgba(2, 6, 23, 0.24);
  color: #f8fbff;
}

.ship-focus::before {
  content: '';
  position: absolute;
  inset: auto auto -26% 54%;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: var(--ship-focus-gradient);
  filter: blur(36px);
  opacity: 0.48;
  pointer-events: none;
}

.ship-focus__hero,
.ship-focus__chips,
.ship-focus__stats,
.ship-focus__footer {
  position: relative;
  z-index: 1;
}

.ship-focus__hero {
  flex-wrap: wrap;
}

.ship-focus__copy {
  flex: 1 1 220px;
  display: grid;
  gap: 8px;
}

.ship-focus__copy h3 {
  margin: 0;
  font-size: clamp(1.42rem, 3vw, 2rem);
}

.ship-focus__eyebrow {
  color: rgba(226, 232, 240, 0.76);
  font-size: 0.86rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.ship-focus__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ship-focus__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.ship-stat {
  display: grid;
  gap: 8px;
  padding: 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.ship-stat span {
  color: rgba(226, 232, 240, 0.82);
  font-size: 0.9rem;
  font-weight: 800;
}

.ship-stat__bar {
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.12);
}

.ship-stat__fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--ship-focus-accent) 72%, white) 0%, white 100%);
}

.ship-focus__footer {
  flex-wrap: wrap;
  align-items: center;
}

.ship-focus__perk {
  display: grid;
  gap: 6px;
  max-width: 32rem;
}

.ship-focus__perk strong {
  font-size: 1rem;
}

@media (min-width: 760px) {
  .selector-header {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }

  .ship-rail {
    grid-auto-columns: minmax(280px, 1fr);
  }
}

@media (max-width: 639px) {
  .ship-focus__stats {
    grid-template-columns: 1fr;
  }
}
</style>
