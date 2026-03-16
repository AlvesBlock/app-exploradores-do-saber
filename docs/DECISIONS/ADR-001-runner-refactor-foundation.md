# ADR-001: Refatoracao de Base do Runner

## Status
Accepted

## Contexto

O runner acumulava problemas estruturais e de produto:

- loop central concentrado demais
- spawn bruto e injusto
- coleta sem semantica forte
- progressao visual desconectada da mecanica
- round data rica sem integracao completa ao runtime

## Decisao

Consolidar o runner em quatro camadas claras:

1. contrato canonico de estado (`runner-state.ts`)
2. runtime de sistemas (`difficulty`, `spawn-manager`, `collision`)
3. orquestracao (`useRunnerLoop`)
4. apresentacao e UX (`RunnerView.vue`)

Tambem foi decidido separar:

- economia de sessao
- progresso persistente do runner
- feedback de runtime

## Consequencias

- o runner ficou testavel em pontos centrais
- pacing e spawn passaram a ser ajustaveis por dados
- rounds e veiculos passaram a existir de fato no fluxo do jogo
- o overlay final passou a refletir o resultado real do runtime

## Referencias

- `src/composables/runner/useRunnerLoop.ts`
- `src/engine/runner/runtime/difficulty.ts`
- `src/engine/runner/runtime/spawn-manager.ts`
- `src/engine/runner/runtime/collision.ts`
- `src/services/runnerProgress.service.ts`
