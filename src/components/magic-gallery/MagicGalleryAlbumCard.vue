<template>
  <button
    type="button"
    class="album-card"
    :class="{ unlocked: item.unlocked, selected }"
    :style="{ '--collection-gradient': collectionGradient }"
    @click="$emit('select')"
  >
    <div class="album-card-frame">
      <img
        v-if="item.unlocked && !imageFailed"
        :src="character.imageUrl"
        :alt="character.name"
        class="album-character-image"
        loading="lazy"
        @error="imageFailed = true"
      />
      <div v-else class="album-character-placeholder">
        <span>{{ item.unlocked ? character.emoji : '🔒' }}</span>
      </div>
    </div>

    <div class="album-card-copy">
      <div class="album-title-row">
        <strong>{{ item.unlocked ? character.name : 'Personagem misterioso' }}</strong>
        <span class="album-rarity">{{ rarityLabel }}</span>
      </div>
      <small>{{ item.unlocked ? character.collectionTitle : `Revelar por ${item.unlockCost} poeiras` }}</small>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import type { MagicGalleryCharacter, MagicGalleryGalleryItem } from '@/types/magic-gallery'

const props = defineProps<{
  character: MagicGalleryCharacter
  item: MagicGalleryGalleryItem
  collectionGradient: string
  selected: boolean
}>()

defineEmits<{
  select: []
}>()

const imageFailed = ref(false)

const rarityLabel = computed(() => {
  switch (props.character.rarity) {
    case 'common':
      return 'brilho'
    case 'rare':
      return 'raro'
    case 'epic':
      return 'epico'
    case 'legendary':
      return 'lendario'
  }

  return 'brilho'
})
</script>

<style scoped>
.album-card {
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 24px;
  padding: 14px;
  display: grid;
  gap: 12px;
  background: var(--collection-gradient);
  text-align: left;
  box-shadow: 0 18px 32px rgba(15, 23, 42, 0.08);
}

.album-card.selected {
  border-color: rgba(37, 99, 235, 0.4);
  box-shadow: 0 22px 38px rgba(37, 99, 235, 0.14);
}

.album-card-frame {
  border-radius: 22px;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  background: rgba(255, 255, 255, 0.82);
  display: grid;
  place-items: center;
}

.album-character-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-character-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.96), transparent 30%),
    linear-gradient(180deg, rgba(191, 219, 254, 0.3) 0%, rgba(196, 181, 253, 0.32) 100%);
}

.album-character-placeholder span {
  font-size: 2.3rem;
}

.album-card-copy {
  display: grid;
  gap: 6px;
}

.album-title-row {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
}

.album-card-copy strong {
  font-size: 1rem;
}

.album-card-copy small {
  color: #5b7187;
  line-height: 1.5;
}

.album-rarity {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.84);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}
</style>
