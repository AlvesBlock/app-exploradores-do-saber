# Estado do Runner (State Machine)

## Estados principais

- `idle`
  - runner carregado
  - overlay de inicio aberto
  - jogador escolhe round e veiculo
- `running`
  - round em andamento
  - loop, spawn, colisao, pacing e HUD ativos
- `paused`
  - runtime congelado
  - musica pausada
- `victory`
  - round concluido com meta atingida
  - overlay final mostra score, recompensa, card e opcao de proximo round
- `gameover`
  - round encerrado por perda de vidas ou meta nao batida ao fim do percurso

## End reasons registrados

- `victory`
- `lives_depleted`
- `missed_target`
- `time_up`
  - reservado para evolucao futura; hoje o percurso termina como `victory` ou `missed_target`

## Transicoes permitidas

- `idle -> running`
  - ao iniciar o round
- `running -> paused`
  - pause manual
- `paused -> running`
  - resume manual
- `running -> victory`
  - percurso concluido e meta de coleta atendida
- `running -> gameover`
  - vidas zeradas
  - ou percurso concluido sem meta suficiente
- `victory -> idle`
  - replay ou volta ao loadout
- `gameover -> idle`
  - replay ou volta ao loadout

## Eventos de runtime

- **Collect**
  - bom: aumenta moedas, ecoScore e progresso qualificado
  - ruim: nao conta para meta e aplica penalidade
  - arriscado/especial:
    - com escudo: conta plenamente
    - sem escudo: entra como manejo incorreto
- **Obstacle hit**
  - sem escudo: perde vida e score
  - com escudo: gera block e consome o escudo
- **Emergency heal**
  - disponivel com 1 vida
  - ultimos 10% do tempo
  - uma vez por round
- **Round end**
  - calcula economia
  - atualiza progresso persistente
  - desbloqueia proximo round se houver vitoria
  - libera veiculos quando carteira total atende requisitos

## Persistencia e retorno

- o estado persistente do runner fica em `runnerProgress.service.ts`
- o estado de sessao e resetado a cada round em `applyRoundConfigToState()`
- o overlay final sempre se baseia em:
  - `roundProgress.finalResult`
  - `roundProgress.finalSummaryText`
  - `roundProgress.finalCard`
  - `roundProgress.finalRankingEntry`
