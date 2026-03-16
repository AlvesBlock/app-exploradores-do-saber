# Economia do Runner

## Camadas da economia

### 1. Economia de sessao
- vive dentro de `gameState.stats`
- usada durante o round
- exemplos:
  - `stats.coins`
  - `stats.score`
  - `stats.qualifiedCollects`
  - `stats.ecoScore`

### 2. Economia persistente
- vive dentro de `runnerProgress.service.ts`
- espelhada em `gameState.meta`
- exemplos:
  - `walletCoins`
  - `walletCarbonCredits`
  - `highestUnlockedRound`
  - `unlockedVehicleIds`

## Moedas

- moedas de sessao sao ganhas durante a corrida
- no fim do round, o total consolidado vira recompensa persistente
- moedas persistentes servem para desbloquear veiculos
- cura emergencial usa moedas da sessao, nao da carteira persistente

## Creditos de carbono

- continuam sendo ganhos no fechamento de round
- dependem de vitoria, ecoScore e colisoes
- sao persistidos e entram na elegibilidade de veiculos

## Veiculos

- o unlock nao e mais decorativo
- quando a carteira persistente atende os requisitos, o veiculo e liberado
- a selecao do veiculo no overlay inicial altera o runtime real:
  - bonus de moedas
  - bonus de ecoScore
  - carga de escudo
  - velocidade de troca de lane
  - protecao de colisao

## Escudo e itens arriscados

- o escudo deixou de ser apenas gasto defensivo
- ele tambem converte coleta arriscada/especial em coleta qualificada
- isso melhora o reward loop:
  - coleta segura carrega escudo
  - escudo libera coleta melhor
  - coleta melhor acelera progresso e recompensa

## Fim de round

Ao fechar o round, o sistema:

1. calcula score final
2. calcula moedas e creditos ganhos
3. atualiza carteira persistente
4. verifica novos veiculos desbloqueados
5. libera o proximo round se houver vitoria
6. salva ranking local

## Cura emergencial

- requisitos:
  - vida atual igual a 1
  - ultimos 10% do tempo
  - moedas de sessao suficientes
  - ainda nao usada no round
- efeito:
  - gasta moedas da sessao
  - restaura 1 vida
  - pode ser usada uma unica vez por round
