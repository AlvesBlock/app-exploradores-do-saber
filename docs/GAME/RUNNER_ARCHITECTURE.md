# Arquitetura do Runner

Este documento registra o estado real do runner apos a refatoracao de producao focada em pacing, spawn justo, semantica de coleta e progressao persistente.

## 1. Mapeamento do modulo

### 1.1 View
- `src/views/RunnerView.vue`
  - HUD mobile-first
  - overlays de inicio, pausa e fim de round
  - selecao de round e veiculo
  - feedback visual e audio
  - fullscreen e sensor de movimento

### 1.2 Composables
- `src/composables/runner/useRunnerLoop.ts`
  - ciclo principal do jogo
  - progresso do round
  - persistencia local de progresso do runner
  - cura emergencial
  - encerramento e avancos de round
- `src/composables/runner/useRunnerInput.ts`
  - teclado e input lateral
  - cooldown de troca de lane
  - gatilhos de start/pause/shield

### 1.3 Runtime / Sistemas
- `src/engine/runner/runtime/difficulty.ts`
  - microfases do round
  - velocidade percebida
  - velocidade de risco
  - intervalos de spawn
  - estimativa de target distance
- `src/engine/runner/runtime/spawn-manager.ts`
  - timers separados para coleta e obstaculo
  - cooldown por lane
  - janela segura
  - tutorial window
  - limite de entidades visiveis
- `src/engine/runner/runtime/collision.ts`
  - resolucao semantica de coleta e obstaculos
  - bloqueio de escudo
  - penalidade por manejo incorreto
  - feedback de runtime

### 1.4 Dominio e dados
- `src/engine/runner/data/rounds.ts`
  - rounds com parametros explicitos de pacing e spawn
- `src/engine/runner/data/wasteTypes.ts`
  - classes de coletavel (`good`, `bad`, `risky`, `special`)
  - itens que exigem escudo para contar como qualificados
- `src/engine/runner/data/obstacles.ts`
  - obstaculos com severidade e penalidade de score
- `src/engine/runner/data/vehicles.ts`
  - beneficios mecanicos reais usados pelo runtime

### 1.5 Utilitarios de dominio
- `src/engine/runner/utils/round-state.ts`
  - reset de round
  - sincronizacao com progresso persistente
  - finalizacao de round e resumo final
- `src/engine/runner/utils/state-mutations.ts`
  - mutations canonicas de score, moedas, ecoScore, escudo e carteira
- `src/engine/runner/utils/scoring.ts`
  - score final, moedas, creditos e penalties de round
- `src/engine/runner/utils/progression.ts`
  - beneficios de veiculo
  - elegibilidade de cura emergencial
- `src/engine/runner/utils/cards.ts`
  - selecao de card educativo

### 1.6 Servicos
- `src/services/runnerAudio.service.ts`
  - efeitos de coleta, erro, bloqueio, cura e fim de round
  - musica de fundo com pause/resume/stop
- `src/services/runnerProgress.service.ts`
  - persistencia local de moedas totais, creditos, rounds liberados, ranking e veiculos

## 2. Responsabilidades consolidadas

- A view nao decide mais gameplay. Ela apresenta HUD, overlays e feedback.
- O loop nao faz mais sorteio bruto. Ele orquestra sistemas de dificuldade, spawn, colisao e progresso.
- Spawn e pacing sairam de formulas escondidas dentro da view e passaram para modulos dedicados.
- O progresso do jogador agora existe em duas camadas:
  - sessao: `stats.coins`, `stats.score`, `qualifiedCollects`, `lives`
  - persistente: `meta.walletCoins`, `meta.walletCarbonCredits`, `meta.highestUnlockedRound`, `meta.unlockedVehicleIds`

## 3. Decisoes arquiteturais importantes

- `RunnerGameState` em `src/types/runner-state.ts` continua sendo a fonte canonica do runtime.
- `src/types/runner.ts` permanece apenas como shim de compatibilidade.
- `vehicleId` e `vehicleLevel` agora apontam para o mesmo estado de progressao real: o veiculo selecionado define beneficios mecanicos e o tier define o nivel visual.
- `currentRound` agora e efetivamente usado com rounds desbloqueaveis e avancos reais.
- `finalResult`, `finalSummaryText` e `endReason` fazem parte do fechamento do round e sustentam o overlay final.

## 4. Debitos tecnicos que restaram menores

- O modulo ainda usa `Math.random` na runtime. Os testes cobrem regras centrais, mas nao existe seed deterministic global.
- Os backgrounds dos rounds 7-10 ainda reutilizam o asset do round 6 como fallback visual.
- O runner ainda nao envia telemetria externa; a base ficou pronta para isso via `telemetry` e `RunnerRoundSummary`.

## 5. Validacoes executadas neste estado

- `npm run type-check`
- `npm run test:unit -- --run`
- `npx eslint ...` nos arquivos alterados do runner
- `npx oxlint ...` nos arquivos alterados do runner
- `npm run build`
