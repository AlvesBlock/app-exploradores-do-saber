# Arquitetura: EcoNave

## Separacao adotada

- `src/views/EcoNaveView.vue`
  shell da tela, HUD, overlays, dialogos, dock de controles e integracao com o Hub
- `src/composables/econave/useEcoNaveGame.ts`
  orquestra loop, persistencia, audio, eventos e atualizacao de HUD
- `src/components/econave/EcoNaveStageCanvas.vue`
  bridge PixiJS isolado do DOM reativo
- `src/engine/econave`
  dados, regras puras, estado inicial e simulacao
- `src/services/econaveProgress.service.ts`
  persistencia versionada e defensiva
- `src/services/econaveAudio.service.ts`
  audio sintetizado com Web Audio e fallback silencioso
- `src/types/econave.ts`
  tipos canonicos do dominio

## Decisoes principais

- o hot path do jogo nao depende de componentes Vue por frame
- a area jogavel usa PixiJS com leitura direta do estado mutavel do runtime
- o HUD e atualizado em baixa frequencia para reduzir custo reativo
- a persistencia usa namespace proprio: `exploradores-econave-progress`
- a rota nova e protegida pelo mesmo contrato de perfil do restante do app

## Integracao com o Hub

- novo card no `HubView`
- nova rota `econave` no roteador principal
- nenhum contrato de progresso dos modulos foi alterado
- nenhum estado do runner foi reutilizado de forma acoplada

