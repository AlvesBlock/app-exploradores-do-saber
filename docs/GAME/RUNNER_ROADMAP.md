# Roadmap do Runner

## Fase 0 - Documentacao e auditoria
- [x] Ler docs e codigo reais
- [x] Mapear divergencias entre docs e runtime
- [x] Registrar diagnostico de pacing, spawn, semantica e progressao

## Fase 1 - Fundamentos e contratos
- [x] Consolidar `RunnerGameState`
- [x] Manter `src/types/runner.ts` apenas como shim
- [x] Limpar estado paralelo morto (`nextEntityId`, `nextRoadMarkerId`, upgrades visuais soltos)
- [x] Separar economia de sessao vs progresso persistente

## Fase 2 - Runtime e gameplay
- [x] Extrair `difficulty`, `spawn-manager` e `collision`
- [x] Rebalancear velocidade inicial e microfases
- [x] Implantar spawn com tutorial window, safe lane e cooldown por lane
- [x] Tornar coleta qualificada realmente qualificada
- [x] Integrar cura emergencial no runtime

## Fase 3 - UX e feedback
- [x] HUD com tempo, progresso, score e escudo
- [x] Overlay final com resumo, recompensa e card educativo
- [x] Feedback visual/sonoro por tipo de evento
- [x] Selecao de round e veiculo no overlay inicial

## Fase 4 - Progressao macro
- [x] Persistir rounds, carteira, veiculos e ranking local
- [x] Liberar proximo round na vitoria
- [x] Alinhar `vehicleId` com beneficios reais

## Fase 5 - Qualidade de producao
- [x] Type-check
- [x] Testes unitarios do runner
- [x] Lint dos arquivos alterados
- [x] Build de producao

## Proximos passos opcionais
- [ ] Integrar analytics externa usando a base de `telemetry`
- [ ] Criar assets dedicados para rounds 7-10
- [ ] Adicionar animacoes mais ricas para eventos especiais
