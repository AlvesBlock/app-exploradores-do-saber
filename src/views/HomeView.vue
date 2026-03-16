<template>
  <div class="kids-page landing-page">
    <div class="kids-container landing-shell">
      <section class="kids-card hero-card">
        <div class="hero-copy">
          <div class="kids-eyebrow">✨ Jornada de 5 dias por modulo</div>
          <h1 class="kids-title">Exploradores do Saber</h1>
          <p class="kids-subtitle">
            Um app infantil com trilhas curtas, quizzes vivos, recompensas claras e aprendizado
            divertido em cada tela.
          </p>

          <div class="hero-actions">
            <Button
              :label="hasProfile ? 'Continuar jornada' : 'Criar meu explorador'"
              icon="pi pi-play"
              size="large"
              @click="goStart"
            />
            <Button
              label="Ver mundos do app"
              icon="pi pi-arrow-down"
              severity="secondary"
              outlined
              size="large"
              @click="scrollToWorlds"
            />
          </div>

          <div class="hero-stats">
            <div class="kids-stat-pill"><span>🎯</span><span>Quiz com progresso real</span></div>
            <div class="kids-stat-pill"><span>🔊</span><span>Feedback curto e claro</span></div>
            <div class="kids-stat-pill"><span>🎉</span><span>Celebracao em cada modulo</span></div>
          </div>
        </div>

        <div class="hero-stage" aria-hidden="true">
          <div class="stage-card stage-card-primary">
            <span>🧑‍🚀</span>
            <strong>Avatares inclusivos</strong>
          </div>
          <div class="stage-card stage-card-secondary">
            <span>📚</span>
            <strong>Missao diaria</strong>
          </div>
          <div class="stage-card stage-card-tertiary">
            <span>🐰</span>
            <strong>Mascote para cuidar</strong>
          </div>
          <div class="planet planet-one">⭐</div>
          <div class="planet planet-two">🪐</div>
          <div class="planet planet-three">💡</div>
        </div>
      </section>

      <section ref="worldsSectionRef" class="worlds-section">
        <div class="section-header">
          <div>
            <div class="kids-eyebrow">🌈 O que a crianca encontra</div>
            <h2 class="kids-section-title">Mundos que ensinam com cara de aventura</h2>
          </div>
          <p class="kids-section-copy">
            Cada modulo usa perguntas variadas, recompensas e uma missao curta para manter o foco.
          </p>
        </div>

        <div class="kids-grid-cards">
          <article
            v-for="module in gameModules"
            :key="module.id"
            class="kids-card world-card"
            :style="{ '--module-color': module.color, '--module-gradient': module.gradient }"
          >
            <div class="world-card-top">
              <span class="world-emoji">{{ module.emoji }}</span>
              <span class="kids-chip info">{{ module.worldLabel }}</span>
            </div>
            <h3>{{ module.title }}</h3>
            <p>{{ module.description }}</p>
            <ul>
              <li v-for="moment in module.learningMoments" :key="moment">{{ moment }}</li>
            </ul>
          </article>
        </div>
      </section>

      <section class="kids-card learning-loop">
        <div>
          <div class="kids-eyebrow">🎮 Loop educativo</div>
          <h2 class="kids-section-title">Aprender, responder, celebrar, voltar</h2>
          <p class="kids-section-copy">
            O app usa apresentacao curta, pergunta com apoio visual, retorno imediato, estrelas e
            encerramento memoravel.
          </p>
        </div>

        <div class="loop-steps">
          <div class="loop-step">
            <span>1</span>
            <strong>Escolha um avatar e um mundo.</strong>
          </div>
          <div class="loop-step">
            <span>2</span>
            <strong>Responda uma sessao curta com 4 desafios.</strong>
          </div>
          <div class="loop-step">
            <span>3</span>
            <strong>Ganhe estrelas, feedback sonoro e confete ao concluir.</strong>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

import { gameModules } from '@/data/modules/modules.data'
import { playerProfileService } from '@/services/playerProfile.service'

const router = useRouter()
const worldsSectionRef = ref<HTMLElement | null>(null)

const hasProfile = computed(() => playerProfileService.exists())

function goStart() {
  router.push(hasProfile.value ? '/hub' : '/onboarding')
}

function scrollToWorlds() {
  worldsSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.landing-shell {
  display: grid;
  gap: 24px;
}

.hero-card {
  padding: 24px;
  display: grid;
  gap: 24px;
  overflow: hidden;
}

.hero-copy {
  display: grid;
  gap: 18px;
}

.hero-actions {
  display: grid;
  gap: 12px;
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-stage {
  position: relative;
  min-height: 320px;
  border-radius: 32px;
  background:
    radial-gradient(circle at 20% 24%, rgba(255, 255, 255, 0.98), transparent 24%),
    linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(251, 191, 36, 0.18) 100%);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.stage-card {
  position: absolute;
  width: min(180px, 42vw);
  border-radius: 24px;
  padding: 16px;
  display: grid;
  gap: 8px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.12);
}

.stage-card span {
  font-size: 2rem;
}

.stage-card-primary {
  top: 18px;
  right: 18px;
}

.stage-card-secondary {
  bottom: 28px;
  left: 18px;
}

.stage-card-tertiary {
  top: 120px;
  left: 28%;
}

.planet {
  position: absolute;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.78);
}

.planet-one {
  top: 20px;
  left: 20px;
}

.planet-two {
  bottom: 34px;
  right: 34px;
}

.planet-three {
  bottom: 126px;
  right: 18%;
}

.worlds-section {
  display: grid;
  gap: 18px;
}

.section-header {
  display: grid;
  gap: 10px;
}

.world-card {
  padding: 20px;
  display: grid;
  gap: 12px;
  background: var(--module-gradient);
}

.world-card-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.world-emoji {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-size: 1.8rem;
  background: rgba(255, 255, 255, 0.88);
}

.world-card h3 {
  margin: 0;
  font-size: 1.3rem;
}

.world-card p,
.world-card li {
  color: #49617a;
  line-height: 1.5;
}

.world-card ul {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
}

.learning-loop {
  padding: 24px;
  display: grid;
  gap: 18px;
}

.loop-steps {
  display: grid;
  gap: 12px;
}

.loop-step {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 22px;
  background: rgba(248, 250, 252, 0.94);
}

.loop-step span {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 900;
}

@media (min-width: 960px) {
  .hero-card {
    grid-template-columns: minmax(0, 1.08fr) minmax(340px, 0.92fr);
    align-items: center;
    padding: 32px;
  }

  .section-header,
  .learning-loop {
    grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
    align-items: end;
  }

  .hero-actions {
    grid-template-columns: repeat(2, minmax(0, max-content));
  }
}
</style>

