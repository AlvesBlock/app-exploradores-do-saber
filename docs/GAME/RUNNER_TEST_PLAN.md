# Plano de Teste do Runner

## Objetivos

- validar que o runner esta apto para deploy
- garantir que pacing, spawn, colisao e progressao batem com o runtime atual
- cobrir os contratos criticos do modulo

## Validacoes automatizadas executadas

- `npm run type-check`
- `npm run test:unit -- --run`
- `npx eslint ...` nos arquivos alterados do runner
- `npx oxlint ...` nos arquivos alterados do runner
- `npm run build`

## Testes unitarios adicionados

- `src/__tests__/runnerDifficulty.spec.ts`
  - curva inicial lenta
  - progressao de fase
  - target distance estimado
- `src/__tests__/runnerCollision.spec.ts`
  - coleta arriscada sem escudo
  - coleta especial protegida
  - bloqueio de escudo
- `src/__tests__/runnerSpawn.spec.ts`
  - tutorial window sem obstaculos
  - safe lane quando duas lanes ja estao ameaçadas
- `src/__tests__/runnerProgress.spec.ts`
  - recompensa persistente
  - unlock de proximo round
  - unlock de veiculo

## Smoke tests manuais recomendados

1. Abrir `/runner`
2. Verificar loadout inicial
3. Trocar round desbloqueado
4. Trocar veiculo desbloqueado
5. Iniciar round e confirmar:
   - HUD legivel
   - shield meter
   - pacing inicial controlado
   - feedback visual e sonoro
6. Coletar item `bad`
7. Coletar item `risky` sem escudo
8. Coletar item `special` com escudo
9. Pausar e retomar
10. Fechar round por vitoria
11. Fechar round por derrota
12. Verificar overlay final e botao de proximo round

## Regressao funcional minima

- start / pause / resume / reset
- corrida com sensor desligado
- corrida com sensor ligado (em device compatível)
- persistencia de:
  - moedas totais
  - creditos totais
  - rounds liberados
  - veiculos liberados
  - ranking
