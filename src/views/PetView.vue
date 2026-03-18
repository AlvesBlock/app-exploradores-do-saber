<template>
  <div class="kids-page pet-page">
    <div class="kids-container">
      <div class="kids-card hero-card p-4 md:p-6 mb-4">
        <div
          class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-4"
        >
          <div>
            <div class="world-chip mb-2">Companheiro da aventura</div>
            <h1 class="kids-title mb-2">Meu Pet Virtual</h1>
            <p class="kids-subtitle mb-0">
              Cuide, brinque, dê banho e coloque seu amiguinho para dormir.
            </p>
          </div>

          <div class="stars-box">
            <span class="text-2xl">⭐</span>
            <strong>{{ totalStars }}</strong>
            <span>estrelas</span>
          </div>
        </div>
      </div>

      <div v-if="!petChosen" class="kids-card p-4 md:p-6 mb-4">
        <h2 class="section-title mb-3">Escolha seu pet</h2>

        <div class="pet-picker-grid">
          <button class="pet-option dog" @click="selectPet('dog')">
            <div class="pet-option-emoji">🐶</div>
            <div class="pet-option-name">Cachorro</div>
            <div class="pet-option-desc">Brincalhão e carinhoso</div>
          </button>

          <button class="pet-option cat" @click="selectPet('cat')">
            <div class="pet-option-emoji">🐱</div>
            <div class="pet-option-name">Gato</div>
            <div class="pet-option-desc">Fofo e dorminhoco</div>
          </button>

          <button class="pet-option bunny" @click="selectPet('bunny')">
            <div class="pet-option-emoji">🐰</div>
            <div class="pet-option-name">Coelho</div>
            <div class="pet-option-desc">Doce e rapidinho</div>
          </button>
        </div>
      </div>

      <div v-else class="grid">
        <div class="col-12 lg:col-7">
          <div class="kids-card pet-scene-card p-4 md:p-6">
            <div class="scene-header mb-3">
              <div>
                <div class="pet-badge">{{ petTypeLabel }}</div>
                <h2 class="pet-name">{{ pet.name }}</h2>
                <p class="pet-mood mb-0">{{ moodLabel }}</p>
              </div>
            </div>

            <div class="pet-room">
              <div class="room-cloud cloud-1"></div>
              <div class="room-cloud cloud-2"></div>

              <div class="room-item bed">🛏️</div>
              <div class="room-item food">🍽️</div>
              <div class="room-item toy">🧸</div>

              <div class="pet-reaction" v-if="reaction">{{ reaction }}</div>

              <div
                class="pet-avatar"
                :class="[
                  petMoodState,
                  {
                    sleeping: activeAction === 'sleep',
                    bathing: activeAction === 'bath',
                    playing: activeAction === 'play',
                    eating: activeAction === 'feed',
                  },
                ]"
              >
                <span class="pet-avatar-body">{{ pet.emoji }}</span>
                <span
                  v-if="petMoodState === 'sleepy' || activeAction === 'sleep'"
                  class="pet-effect zzz"
                  >💤</span
                >
                <span v-if="petMoodState === 'hungry'" class="pet-effect hungry">🍖</span>
                <span v-if="petMoodState === 'dirty'" class="pet-effect dirty">🫧</span>
                <span v-if="petMoodState === 'excited'" class="pet-effect sparkle">✨</span>
              </div>
            </div>

            <div class="action-bar">
              <button class="action-btn feed" @click="feedPet">🍎 Alimentar</button>
              <button class="action-btn bath" @click="bathPet">🛁 Banho</button>
              <button class="action-btn play" @click="playWithPet">🎾 Brincar</button>
              <button class="action-btn sleep" @click="sleepPet">🌙 Dormir</button>
            </div>
          </div>
        </div>

        <div class="col-12 lg:col-5">
          <div class="kids-card p-4 md:p-6 mb-4">
            <h3 class="section-title mb-3">Como está seu pet?</h3>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-top">
                  <span>🍖</span>
                  <strong>Fome</strong>
                </div>
                <ProgressBar :value="pet.hunger" style="height: 14px" />
              </div>

              <div class="stat-card">
                <div class="stat-top">
                  <span>😴</span>
                  <strong>Sono</strong>
                </div>
                <ProgressBar :value="pet.energy" style="height: 14px" />
              </div>

              <div class="stat-card">
                <div class="stat-top">
                  <span>🫧</span>
                  <strong>Higiene</strong>
                </div>
                <ProgressBar :value="pet.hygiene" style="height: 14px" />
              </div>

              <div class="stat-card">
                <div class="stat-top">
                  <span>💖</span>
                  <strong>Alegria</strong>
                </div>
                <ProgressBar :value="pet.happiness" style="height: 14px" />
              </div>
            </div>
          </div>

          <div class="kids-card p-4 md:p-6 mb-4">
            <h3 class="section-title mb-3">Conquistas</h3>

            <div class="reward-box">
              <div>
                🍎 Lanchinhos dados: <strong>{{ pet.snacks }}</strong>
              </div>
              <div>
                🛁 Banhos: <strong>{{ pet.baths }}</strong>
              </div>
              <div>
                🎾 Brincadeiras: <strong>{{ pet.plays }}</strong>
              </div>
              <div>
                🌙 Sonecas: <strong>{{ pet.sleeps }}</strong>
              </div>
            </div>
          </div>

          <div class="kids-card p-4 md:p-6">
            <Button
              label="Voltar ao hub"
              icon="pi pi-arrow-left"
              severity="secondary"
              outlined
              class="w-full"
              @click="goHub"
            />
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

const router = useRouter()
const toast = useToast()

type PetKind = 'dog' | 'cat' | 'bunny'

const petMoodState = computed(() => {
  const { happiness, energy, hygiene, hunger } = pet.value
  const avg = (happiness + energy + hygiene + hunger) / 4

  if (energy <= 30) return 'sleepy'
  if (hygiene <= 30) return 'dirty'
  if (hunger <= 30) return 'hungry'
  if (happiness <= 35) return 'sad'
  if (avg >= 80) return 'excited'
  return 'happy'
})

interface PetState {
  type: PetKind
  emoji: string
  name: string
  happiness: number
  energy: number
  hygiene: number
  hunger: number
  snacks: number
  baths: number
  plays: number
  sleeps: number
}

const totalStars = ref(12)
const petChosen = ref(false)
const activeAction = ref<'feed' | 'bath' | 'play' | 'sleep' | null>(null)
const reaction = ref('')

const pet = ref<PetState>({
  type: 'dog',
  emoji: '🐶',
  name: 'Pipoca',
  happiness: 72,
  energy: 70,
  hygiene: 66,
  hunger: 64,
  snacks: 0,
  baths: 0,
  plays: 0,
  sleeps: 0,
})

const petTypeLabel = computed(() => {
  if (pet.value.type === 'dog') return 'Cachorro aventureiro'
  if (pet.value.type === 'cat') return 'Gatinho mágico'
  return 'Coelhinho saltitante'
})

const moodLabel = computed(() => {
  const avg = (pet.value.happiness + pet.value.energy + pet.value.hygiene + pet.value.hunger) / 4

  if (avg >= 85) return 'Está radiante, limpinho e super feliz! ✨'
  if (avg >= 65) return 'Está contente e quer sua atenção 💛'
  if (avg >= 45) return 'Precisa de um pouco mais de cuidado 🥺'
  return 'Está tristinho. Vamos cuidar dele agora?'
})

function clamp(value: number) {
  return Math.max(0, Math.min(100, value))
}

function selectPet(type: PetKind) {
  petChosen.value = true

  if (type === 'dog') {
    pet.value = {
      type: 'dog',
      emoji: '🐶',
      name: 'Pipoca',
      happiness: 72,
      energy: 70,
      hygiene: 66,
      hunger: 64,
      snacks: 0,
      baths: 0,
      plays: 0,
      sleeps: 0,
    }
  }

  if (type === 'cat') {
    pet.value = {
      type: 'cat',
      emoji: '🐱',
      name: 'Nino',
      happiness: 68,
      energy: 78,
      hygiene: 70,
      hunger: 60,
      snacks: 0,
      baths: 0,
      plays: 0,
      sleeps: 0,
    }
  }

  if (type === 'bunny') {
    pet.value = {
      type: 'bunny',
      emoji: '🐰',
      name: 'Floquinho',
      happiness: 75,
      energy: 74,
      hygiene: 68,
      hunger: 62,
      snacks: 0,
      baths: 0,
      plays: 0,
      sleeps: 0,
    }
  }

  toast.add({
    severity: 'success',
    summary: 'Novo amiguinho!',
    detail: `${pet.value.name} agora faz parte da sua aventura.`,
    life: 2400,
  })
}

function pulseReaction(text: string, action: 'feed' | 'bath' | 'play' | 'sleep') {
  reaction.value = text
  activeAction.value = action

  setTimeout(() => {
    reaction.value = ''
    activeAction.value = null
  }, 1400)
}

function feedPet() {
  if (totalStars.value < 1) {
    toast.add({
      severity: 'warn',
      summary: 'Sem estrelas',
      detail: 'Você precisa de 1 estrela para dar um lanchinho.',
      life: 2200,
    })
    return
  }

  totalStars.value -= 1
  pet.value.hunger = clamp(pet.value.hunger + 22)
  pet.value.happiness = clamp(pet.value.happiness + 10)
  pet.value.energy = clamp(pet.value.energy + 4)
  pet.value.snacks += 1

  pulseReaction('😋✨', 'feed')

  toast.add({
    severity: 'success',
    summary: 'Que delícia!',
    detail: `${pet.value.name} comeu feliz.`,
    life: 2000,
  })
}

function bathPet() {
  pet.value.hygiene = clamp(pet.value.hygiene + 28)
  pet.value.happiness = clamp(pet.value.happiness + 6)
  pet.value.baths += 1

  pulseReaction('🫧🛁', 'bath')

  toast.add({
    severity: 'info',
    summary: 'Banho tomado!',
    detail: `${pet.value.name} ficou limpinho e cheiroso.`,
    life: 2000,
  })
}

function playWithPet() {
  pet.value.happiness = clamp(pet.value.happiness + 18)
  pet.value.energy = clamp(pet.value.energy - 10)
  pet.value.hunger = clamp(pet.value.hunger - 6)
  pet.value.plays += 1

  pulseReaction('🎉💖', 'play')

  toast.add({
    severity: 'success',
    summary: 'Diversão total!',
    detail: `${pet.value.name} adorou brincar com você.`,
    life: 2000,
  })
}

function sleepPet() {
  pet.value.energy = clamp(pet.value.energy + 30)
  pet.value.happiness = clamp(pet.value.happiness + 5)
  pet.value.sleeps += 1

  pulseReaction('💤🌙', 'sleep')

  toast.add({
    severity: 'info',
    summary: 'Boa noite',
    detail: `${pet.value.name} tirou uma sonequinha gostosa.`,
    life: 2000,
  })
}

function goHub() {
  router.push('/hub')
}
</script>

<style scoped>
.pet-page {
  background:
    radial-gradient(circle at top left, #fff6d8 0%, transparent 30%),
    radial-gradient(circle at top right, #dff5ff 0%, transparent 28%),
    linear-gradient(180deg, #fffdf7 0%, #f7fbff 100%);
  min-height: 100vh;
}

.hero-card {
  background: linear-gradient(135deg, #fff8df 0%, #eef8ff 100%);
}

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

.section-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #3c2b12;
}

.pet-picker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.pet-option {
  border: none;
  border-radius: 24px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.pet-option:hover {
  transform: translateY(-4px);
}

.pet-option.dog {
  background: linear-gradient(180deg, #fff1d8 0%, #ffe1b8 100%);
}

.pet-option.cat {
  background: linear-gradient(180deg, #f2ebff 0%, #e2d6ff 100%);
}

.pet-option.bunny {
  background: linear-gradient(180deg, #e8fff0 0%, #c8f5d8 100%);
}

.pet-option-emoji {
  font-size: 3.5rem;
  line-height: 1;
  margin-bottom: 8px;
}

.pet-option-name {
  font-weight: 800;
  font-size: 1.05rem;
}

.pet-option-desc {
  margin-top: 6px;
  font-size: 0.92rem;
  color: #5a5a5a;
}

.pet-scene-card {
  overflow: hidden;
}

.scene-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.pet-badge {
  display: inline-flex;
  background: #fff0c2;
  color: #7a5600;
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 700;
  margin-bottom: 10px;
}

.pet-name {
  font-size: 2rem;
  line-height: 1.1;
  margin: 0 0 8px;
  font-weight: 900;
  color: #2f2240;
}

.pet-mood {
  font-weight: 700;
  color: #6a6280;
}

.pet-room {
  position: relative;
  min-height: 360px;
  border-radius: 28px;
  margin-top: 8px;
  padding: 24px;
  overflow: hidden;
  background: linear-gradient(180deg, #dff3ff 0%, #eefcff 45%, #ffeccf 45%, #ffe6b8 100%);
  box-shadow: inset 0 -10px 0 rgba(255, 255, 255, 0.28);
}

.room-cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 999px;
  filter: blur(1px);
}

.cloud-1 {
  width: 96px;
  height: 32px;
  top: 22px;
  left: 24px;
}

.cloud-2 {
  width: 72px;
  height: 28px;
  top: 50px;
  right: 30px;
}

.room-item {
  position: absolute;
  font-size: 2.2rem;
}

.room-item.bed {
  bottom: 24px;
  left: 24px;
}

.room-item.food {
  bottom: 28px;
  right: 24px;
}

.room-item.toy {
  bottom: 108px;
  right: 34px;
}

.pet-avatar {
  position: absolute;
  left: 50%;
  bottom: 58px;
  transform: translateX(-50%);
  font-size: 7rem;
  line-height: 1;
  transition:
    transform 0.25s ease,
    filter 0.25s ease,
    opacity 0.25s ease;
  filter: drop-shadow(0 12px 10px rgba(0, 0, 0, 0.12));
}

.pet-avatar.playing {
  transform: translateX(-50%) translateY(-10px) scale(1.08);
}

.pet-avatar.eating {
  transform: translateX(-50%) scale(1.04);
}

.pet-avatar.bathing {
  filter: drop-shadow(0 12px 10px rgba(0, 0, 0, 0.12)) brightness(1.04);
}

.pet-avatar.sleeping {
  transform: translateX(-50%) translateY(4px);
  opacity: 0.92;
}

.pet-reaction {
  position: absolute;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  font-weight: 900;
  animation: popFloat 1.2s ease forwards;
}

@keyframes popFloat {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(12px) scale(0.7);
  }
  20% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1.08);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-24px) scale(1);
  }
}

.action-bar {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.action-btn {
  border: none;
  border-radius: 18px;
  padding: 16px 14px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease;
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.08);
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn.feed {
  background: #ffe08c;
}
.action-btn.bath {
  background: #cfeeff;
}
.action-btn.play {
  background: #ffd5ea;
}
.action-btn.sleep {
  background: #ddd6ff;
}

.stats-grid {
  display: grid;
  gap: 12px;
}

.stat-card {
  background: #fffaf2;
  border-radius: 18px;
  padding: 14px;
}

.stat-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-weight: 800;
}

.reward-box {
  display: grid;
  gap: 10px;
  background: linear-gradient(180deg, #fff7e2 0%, #fffdf4 100%);
  border-radius: 20px;
  padding: 14px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .pet-room {
    min-height: 300px;
  }

  .pet-avatar {
    font-size: 5.8rem;
  }

  .action-bar {
    grid-template-columns: 1fr 1fr;
  }
}

.pet-avatar {
  position: absolute;
  left: 50%;
  bottom: 58px;
  transform: translateX(-50%);
  font-size: 7rem;
  line-height: 1;
  transition:
    transform 0.25s ease,
    filter 0.25s ease,
    opacity 0.25s ease;
  filter: drop-shadow(0 12px 10px rgba(0, 0, 0, 0.12));
  animation: petIdle 2.8s ease-in-out infinite;
}

.pet-avatar-body {
  display: inline-block;
  animation: petBlinkScale 4s ease-in-out infinite;
}

.pet-avatar.happy .pet-avatar-body {
  animation: petBlinkScale 4s ease-in-out infinite;
}

.pet-avatar.excited {
  animation: petIdle 1.6s ease-in-out infinite;
}

.pet-avatar.excited .pet-avatar-body {
  animation: petBounce 0.9s ease-in-out infinite;
}

.pet-avatar.sad {
  filter: grayscale(0.12) drop-shadow(0 10px 8px rgba(0, 0, 0, 0.1));
  transform: translateX(-50%) translateY(6px) scale(0.96);
}

.pet-avatar.hungry .pet-avatar-body {
  animation: petWiggle 1.8s ease-in-out infinite;
}

.pet-avatar.dirty {
  filter: saturate(0.9) brightness(0.96) drop-shadow(0 12px 10px rgba(0, 0, 0, 0.12));
}

.pet-avatar.sleepy {
  opacity: 0.9;
  transform: translateX(-50%) translateY(8px);
}

.pet-avatar.playing {
  transform: translateX(-50%) translateY(-10px) scale(1.08);
}

.pet-avatar.eating {
  transform: translateX(-50%) scale(1.04) rotate(-2deg);
}

.pet-avatar.bathing {
  transform: translateX(-50%) scale(1.03);
  filter: brightness(1.06) drop-shadow(0 12px 10px rgba(0, 0, 0, 0.12));
}

.pet-avatar.sleeping {
  opacity: 0.88;
  transform: translateX(-50%) translateY(10px) scale(0.98);
}

.pet-effect {
  position: absolute;
  font-size: 1.8rem;
  animation: floatEffect 1.8s ease-in-out infinite;
}

.pet-effect.zzz {
  top: -18px;
  right: -10px;
}

.pet-effect.hungry {
  top: 10px;
  right: -18px;
}

.pet-effect.dirty {
  top: -8px;
  left: -10px;
}

.pet-effect.sparkle {
  top: -16px;
  left: -14px;
}

@keyframes petIdle {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-6px);
  }
}

@keyframes petBounce {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.05) rotate(-4deg);
  }
  50% {
    transform: scale(1.1) rotate(0deg);
  }
  75% {
    transform: scale(1.05) rotate(4deg);
  }
}

@keyframes petWiggle {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-4deg);
  }
  75% {
    transform: rotate(4deg);
  }
}

@keyframes petBlinkScale {
  0%,
  45%,
  100% {
    transform: scaleY(1);
  }
  48% {
    transform: scaleY(0.92);
  }
  50% {
    transform: scaleY(0.85);
  }
  52% {
    transform: scaleY(1);
  }
}

@keyframes floatEffect {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.9;
  }
  50% {
    transform: translateY(-8px);
    opacity: 1;
  }
}
</style>
