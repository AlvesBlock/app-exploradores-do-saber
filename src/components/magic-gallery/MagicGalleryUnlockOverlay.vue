<template>
  <div v-if="visible" class="unlock-overlay" role="dialog" aria-modal="true" aria-labelledby="magic-gallery-unlock-title">
    <div class="unlock-scrim" @click="$emit('close')"></div>

    <section class="kids-card unlock-panel">
      <div class="unlock-stars" aria-hidden="true">
        <span>✨</span>
        <span>🌟</span>
        <span>💫</span>
      </div>

      <div class="unlock-badge">PLUS liberado</div>
      <h2 id="magic-gallery-unlock-title">A Galeria Encantada apareceu no seu Hub!</h2>
      <p>
        Voce concluiu todos os mundos principais e abriu um portal raro cheio de album, quiz,
        memoria e recompensas especiais.
      </p>

      <div class="unlock-portal" aria-hidden="true">
        <div class="unlock-ring unlock-ring-one"></div>
        <div class="unlock-ring unlock-ring-two"></div>
        <div class="unlock-core">✨</div>
      </div>

      <div class="unlock-rewards">
        <div class="kids-stat-pill"><span>🖼️</span><span>{{ totalCharacters }} figurinhas para revelar</span></div>
        <div class="kids-stat-pill"><span>✨</span><span>{{ magicDust }} poeira magica inicial</span></div>
        <div class="kids-stat-pill"><span>🎁</span><span>Kit Plus entregue</span></div>
      </div>

      <div class="unlock-actions">
        <Button label="Explorar agora" icon="pi pi-sparkles" @click="$emit('open')" />
        <Button label="Ver depois" icon="pi pi-times" severity="secondary" outlined @click="$emit('close')" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  visible: boolean
  totalCharacters: number
  magicDust: number
}>()

defineEmits<{
  close: []
  open: []
}>()
</script>

<style scoped>
.unlock-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 18px;
}

.unlock-scrim {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.52);
  backdrop-filter: blur(12px);
}

.unlock-panel {
  position: relative;
  z-index: 1;
  width: min(100%, 560px);
  padding: 28px 22px;
  display: grid;
  gap: 18px;
  justify-items: center;
  text-align: center;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.98), transparent 34%),
    linear-gradient(180deg, rgba(238, 242, 255, 0.98) 0%, rgba(255, 247, 237, 0.98) 100%);
}

.unlock-stars {
  display: flex;
  gap: 12px;
  font-size: 1.5rem;
}

.unlock-stars span {
  animation: float-star 2.8s ease-in-out infinite;
}

.unlock-stars span:nth-child(2) {
  animation-delay: 0.2s;
}

.unlock-stars span:nth-child(3) {
  animation-delay: 0.4s;
}

.unlock-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 999px;
  background: linear-gradient(90deg, #4338ca 0%, #a855f7 50%, #f59e0b 100%);
  color: white;
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.unlock-panel h2 {
  margin: 0;
  font-size: clamp(1.7rem, 5vw, 2.4rem);
}

.unlock-panel p {
  margin: 0;
  color: #52667d;
  line-height: 1.6;
}

.unlock-portal {
  position: relative;
  width: 180px;
  height: 180px;
  display: grid;
  place-items: center;
}

.unlock-ring,
.unlock-core {
  position: absolute;
  border-radius: 999px;
}

.unlock-ring {
  inset: 0;
  border: 4px solid rgba(99, 102, 241, 0.28);
}

.unlock-ring-one {
  animation: spin-ring 12s linear infinite;
}

.unlock-ring-two {
  inset: 18px;
  border-color: rgba(245, 158, 11, 0.38);
  animation: spin-ring-reverse 10s linear infinite;
}

.unlock-core {
  inset: 48px;
  display: grid;
  place-items: center;
  font-size: 2.4rem;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.96), transparent 34%),
    linear-gradient(135deg, #2563eb 0%, #7c3aed 52%, #f59e0b 100%);
  color: white;
  box-shadow: 0 24px 38px rgba(76, 29, 149, 0.28);
}

.unlock-rewards,
.unlock-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.unlock-actions :deep(.p-button) {
  min-width: 190px;
}

@keyframes spin-ring {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-ring-reverse {
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0deg);
  }
}

@keyframes float-star {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}
</style>
