# Changelog do Runner

Toda mudanca relevante no modulo Runner deve ser registrada aqui.

## [Unreleased]

### Runtime e arquitetura
- `useRunnerLoop` deixou de concentrar spawn bruto e passou a orquestrar sistemas dedicados de dificuldade, spawn e colisao.
- `RunnerGameState` foi ampliado para contemplar `telemetry`, `ui`, `endReason`, `finalResult` e carteira persistente.
- `src/types/runner.ts` permanece apenas como shim; o runtime usa `src/types/runner-state.ts`.
- `runnerProgress.service.ts` foi criado para persistir rounds liberados, veiculos, carteira e ranking local.

### Gameplay
- Round 1 foi desacelerado e os rounds ganharam parametros explicitos de pacing.
- Spawn agora tem:
  - tutorial window
  - timers separados
  - cooldown por lane
  - safe lane
  - limite de entidades visiveis
- Coleta agora possui semantica real:
  - `good`
  - `bad`
  - `risky`
  - `special`
- Itens arriscados e especiais podem exigir escudo para contar como qualificados.
- Obstaculos passaram a usar severidade e penalidade de score.
- Cura emergencial foi integrada ao runtime.

### UX / feedback
- HUD mostra tempo, progresso, score e carga de escudo.
- Overlay final mostra score, recompensa, card educativo e unlocks.
- O overlay inicial ganhou selecao de round e veiculo.
- O overlay inicial agora usa card mobile-first com scroll interno e CTA principal fixado no rodape de acao.
- O dock inferior foi reorganizado para separar movimento e acoes, preservando uma safe area livre para a pista e para o avatar.
- Audio agora diferencia coleta, erro, bloqueio, cura e fim de round, com musica de fundo por fase do jogo.

### Qualidade
- Testes unitarios adicionados para dificuldade, colisao, spawn e progresso persistente.
- Build, type-check e lint dos arquivos alterados foram validados neste estado.
