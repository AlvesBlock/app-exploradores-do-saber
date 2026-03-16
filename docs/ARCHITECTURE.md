# Arquitetura do Projeto

## Visao geral por camadas

### 1) Apresentacao (UI)
- `src/views/`
  - telas principais do app
  - `RunnerView.vue` agora cuida apenas de apresentacao, HUD, overlays, fullscreen e sensores
- `src/assets/`
  - imagens, audio e estilos

### 2) Dominio / gameplay do runner
- `src/engine/runner/data/`
  - configuracoes de rounds, residuos, obstaculos, veiculos e cards
- `src/engine/runner/runtime/`
  - sistemas de dificuldade, spawn e colisao
- `src/engine/runner/utils/`
  - round-state, scoring, progression, cards e mutations

### 3) Orquestracao
- `src/composables/runner/`
  - `useRunnerLoop.ts`
  - `useRunnerInput.ts`

### 4) Servicos
- `src/services/playerProfile.service.ts`
  - perfil geral do app
- `src/services/runnerProgress.service.ts`
  - progresso persistente do runner
- `src/services/runnerAudio.service.ts`
  - efeitos e musica do runner

### 5) Tipos / contratos
- `src/types/runner-state.ts`
  - contrato canonico do estado do runner
- `src/types/runner-game.ts`
  - dados de gameplay, feedback, resumo e progresso persistente
- `src/types/runner.ts`
  - shim de compatibilidade

## Ponto arquitetural importante

O runner saiu do modelo "view + loop monolitico" e passou para:

- view focada em UX
- composable focado em orquestracao
- runtime focado em sistemas testaveis
- servico focado em persistencia

## Riscos ainda conhecidos

- nao existe seed deterministica global para `Math.random`
- rounds 7-10 ainda reutilizam o mesmo background fallback
- telemetria externa ainda nao foi integrada
